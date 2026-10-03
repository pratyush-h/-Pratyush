import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("student_agents.database")

# In-memory mock storage fallback in case MongoDB server is unreachable
in_memory_db = {
    "users": [],
    "question_papers": [],
    "agent_logs": [],
    "predictions": []
}

is_mongo_connected = False

try:
    client = AsyncIOMotorClient(
        settings.MONGO_DETAILS,
        serverSelectionTimeoutMS=2500
    )
    # Parse DB name from URI or default to student_db
    db_name = "student_db"
    if "/" in settings.MONGO_DETAILS.split("?")[0]:
        potential_db = settings.MONGO_DETAILS.split("?")[0].split("/")[-1]
        if potential_db:
            db_name = potential_db

    database = client[db_name]
    user_collection = database.get_collection("users")
    question_paper_collection = database.get_collection("question_papers")
    agent_log_collection = database.get_collection("agent_logs")
    prediction_collection = database.get_collection("predictions")
    is_mongo_connected = True
    logger.info(f"MongoDB client initialized for database: {db_name}")
except Exception as e:
    logger.warning(f"Could not connect directly to MongoDB: {e}. In-memory fallback ready.")
    database = None
    user_collection = None
    question_paper_collection = None
    agent_log_collection = None
    prediction_collection = None
    is_mongo_connected = False

async def check_mongo_health():
    """Verify live connectivity to MongoDB Atlas / Compass"""
    try:
        if database is not None:
            await database.command("ping")
            return {"status": "connected", "type": "MongoDB Atlas / Compass", "uri": settings.MONGO_DETAILS.split("@")[-1]}
    except Exception as e:
        return {"status": "offline_mode", "detail": str(e), "fallback": "Local Memory Active"}
    return {"status": "offline_mode", "fallback": "Local Memory Active"}
