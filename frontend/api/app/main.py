import time
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import (
    user_collection,
    question_paper_collection,
    agent_log_collection,
    prediction_collection,
    in_memory_db,
    check_mongo_health,
    is_mongo_connected
)
from app.models import (
    UserRegister,
    UserLogin,
    Token,
    PredictRequest,
    PredictResponse,
    QuestionPaperUpload,
    AgentLog
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_optional_user
)
from app.agents.graph import run_multi_agent_pipeline, parse_uploaded_document

app = FastAPI(
    title="Student Multi-Agent Intelligence System API",
    version="1.0.0",
    description="Production-grade multi-agent backend for university question paper analysis, future question prediction, and MongoDB tracking."
)

# Enable CORS for frontend integration (Vercel, Localhost, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. HEALTH & SYSTEM DIAGNOSTICS ---
@app.get("/")
async def root():
    mongo_health = await check_mongo_health()
    return {
        "status": "online",
        "service": "Student Multi-Agent Intelligence Platform",
        "version": "1.0.0",
        "database": mongo_health,
        "compass_instructions": f"Connect your MongoDB Compass to: {settings.MONGO_DETAILS}",
        "docs_url": "/docs"
    }

# --- 2. AUTHENTICATION ENDPOINTS ---
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    # Check if user exists in MongoDB
    if user_collection is not None:
        try:
            existing = await user_collection.find_one({"email": user.email.lower()})
            if existing:
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
        except Exception:
            pass

    # Check fallback memory
    for u in in_memory_db["users"]:
        if u["email"].lower() == user.email.lower():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")

    hashed = hash_password(user.password)
    user_doc = {
        "full_name": user.full_name,
        "email": user.email.lower(),
        "password": hashed,
        "university": user.university,
        "role": "student",
        "created_at": datetime.utcnow()
    }

    # Insert into MongoDB
    inserted_id = None
    if user_collection is not None:
        try:
            result = await user_collection.insert_one(user_doc)
            inserted_id = str(result.inserted_id)
        except Exception:
            pass

    if not inserted_id:
        inserted_id = f"usr_{len(in_memory_db['users']) + 1}"
        user_doc["_id"] = inserted_id
        in_memory_db["users"].append(user_doc)

    # Automatically generate login token for quick onboarding
    token = create_access_token({"sub": user.email.lower()})
    return {
        "message": "User registered successfully!",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": inserted_id,
            "full_name": user.full_name,
            "email": user.email.lower(),
            "university": user.university
        }
    }

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    email = credentials.email.lower()
    user_record = None

    if user_collection is not None:
        try:
            user_record = await user_collection.find_one({"email": email})
        except Exception:
            pass

    if not user_record:
        for u in in_memory_db["users"]:
            if u["email"] == email:
                user_record = u
                break

    if not user_record or not verify_password(credentials.password, user_record["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password. Please verify your credentials."
        )

    access_token = create_access_token(data={"sub": user_record["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "full_name": user_record.get("full_name", "Student"),
            "email": user_record.get("email"),
            "university": user_record.get("university", "General")
        }
    }

@app.get("/api/auth/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}

# --- 3. MULTI-AGENT PREDICTION PIPELINE ---
@app.post("/api/agents/predict-questions", response_model=PredictResponse)
async def predict_exam_questions(
    request: PredictRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    start_time = time.time()
    
    # Run through the 5-Agent LangGraph Pipeline
    result = run_multi_agent_pipeline(
        subject=request.subject,
        syllabus_topics=request.syllabus_topics,
        past_questions=request.past_questions,
        target_university=request.target_university or "General University",
        exam_type=request.exam_type or "End Semester Exam"
    )

    total_duration_ms = int((time.time() - start_time) * 1000)
    user_email = current_user.get("email", "guest_student@campus.edu") if current_user else "guest_student@campus.edu"

    # Prepare Mongo Audit Log & Prediction Records
    log_doc = {
        "user_email": user_email,
        "action": "question_prediction_generation",
        "subject": request.subject,
        "execution_time_ms": total_duration_ms,
        "trace": result["agent_trace"],
        "timestamp": datetime.utcnow()
    }

    pred_doc = {
        "user_email": user_email,
        "subject": request.subject,
        "syllabus_topics": request.syllabus_topics,
        "predictions": result["predictions"],
        "topic_weights": result["topic_weights"],
        "bloom_distribution": result["bloom_distribution"],
        "created_at": datetime.utcnow()
    }

    # Persist to MongoDB
    if agent_log_collection is not None and prediction_collection is not None:
        try:
            await agent_log_collection.insert_one(log_doc)
            await prediction_collection.insert_one(pred_doc)
        except Exception:
            in_memory_db["agent_logs"].append(log_doc)
            in_memory_db["predictions"].append(pred_doc)
    else:
        in_memory_db["agent_logs"].append(log_doc)
        in_memory_db["predictions"].append(pred_doc)

    return result

# --- 4. QUESTION PAPER UPLOAD & PARSER AGENT ---
@app.post("/api/papers/upload")
async def upload_question_paper(
    file: UploadFile = File(...),
    subject: str = Form(...),
    university: str = Form(...),
    year: int = Form(2024),
    semester: str = Form("Semester 5"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    contents = await file.read()
    parsed_info = parse_uploaded_document(contents, file.filename)

    paper_doc = {
        "subject": subject,
        "university": university,
        "year": year,
        "semester": semester,
        "filename": file.filename,
        "parsed_questions": parsed_info["extracted_questions"],
        "uploaded_by": current_user.get("email", "guest") if current_user else "guest",
        "uploaded_at": datetime.utcnow()
    }

    # Store in MongoDB
    if question_paper_collection is not None:
        try:
            await question_paper_collection.insert_one(paper_doc)
        except Exception:
            in_memory_db["question_papers"].append(paper_doc)
    else:
        in_memory_db["question_papers"].append(paper_doc)

    return {
        "status": "success",
        "message": f"Successfully parsed {len(parsed_info['extracted_questions'])} questions from {file.filename}.",
        "data": paper_doc
    }

@app.get("/api/papers")
async def list_question_papers(subject: Optional[str] = None):
    results = []
    if question_paper_collection is not None:
        try:
            query = {"subject": {"$regex": subject, "$options": "i"}} if subject else {}
            cursor = question_paper_collection.find(query).sort("uploaded_at", -1).limit(50)
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                doc.pop("_id", None)
                results.append(doc)
        except Exception:
            pass

    if not results:
        # Load from in-memory fallback
        for doc in in_memory_db["question_papers"]:
            clean_doc = dict(doc)
            clean_doc.pop("_id", None)
            results.append(clean_doc)

    # If empty, supply representative starter past paper data
    if not results:
        results = [
            {
                "id": "pyq-1",
                "subject": "Operating Systems & Concurrency",
                "university": "JNTU / VTU / State Univ",
                "year": 2024,
                "semester": "Semester 5",
                "filename": "OS_Dec_2024_Paper.pdf",
                "parsed_questions": [
                    "Explain Process Control Block (PCB) structure and state transitions.",
                    "Derive Banker's Algorithm for deadlock avoidance with a numerical matrix.",
                    "Differentiate between paging and segmentation with addressing diagrams.",
                    "Analyze Virtual Memory page replacement policies: FIFO vs LRU."
                ]
            },
            {
                "id": "pyq-2",
                "subject": "Database Management Systems",
                "university": "Anna University / Central Univ",
                "year": 2023,
                "semester": "Semester 4",
                "filename": "DBMS_May_2023_Paper.pdf",
                "parsed_questions": [
                    "State and prove ACID properties with transaction lifecycle diagram.",
                    "Explain B+ Tree indexing and calculate fanout given block sizes.",
                    "Normalize the given relational schema into 3NF and BCNF.",
                    "Compare Two-Phase Locking (2PL) protocols vs Timestamp ordering."
                ]
            }
        ]

    return {"count": len(results), "papers": results}

# --- 5. AUDIT LOGS & DATABASE STATS (MONGODB COMPASS COMPANION) ---
@app.get("/api/logs")
async def get_agent_audit_logs():
    logs = []
    if agent_log_collection is not None:
        try:
            cursor = agent_log_collection.find({}).sort("timestamp", -1).limit(20)
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                doc.pop("_id", None)
                logs.append(doc)
        except Exception:
            pass

    if not logs:
        logs = in_memory_db["agent_logs"][-20:]

    return {"total_logs": len(logs), "logs": logs}

@app.get("/api/database/stats")
async def get_database_stats():
    user_count = 0
    paper_count = 0
    log_count = 0
    pred_count = 0

    if user_collection is not None:
        try:
            user_count = await user_collection.count_documents({})
            paper_count = await question_paper_collection.count_documents({})
            log_count = await agent_log_collection.count_documents({})
            pred_count = await prediction_collection.count_documents({})
        except Exception:
            pass

    return {
        "mongo_connection": "Online" if is_mongo_connected else "Offline/Local Fallback",
        "connection_uri": settings.MONGO_DETAILS,
        "collections": {
            "users": max(user_count, len(in_memory_db["users"])),
            "question_papers": max(paper_count, len(in_memory_db["question_papers"])),
            "agent_logs": max(log_count, len(in_memory_db["agent_logs"])),
            "predictions": max(pred_count, len(in_memory_db["predictions"]))
        },
        "compass_tip": "To view these live in MongoDB Compass, open Compass, paste your connection URI, and open database 'student_db'."
    }
