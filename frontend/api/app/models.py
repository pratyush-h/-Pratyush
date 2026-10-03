from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str = Field(..., example="Pratyush Sharma")
    email: str = Field(..., example="student@university.edu")
    password: str = Field(..., min_length=6)
    university: str = Field(..., example="JNTU / Anna University / VTU")

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    id: Optional[str] = None
    full_name: str
    email: str
    university: str
    created_at: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[Dict[str, Any]] = None

class ParsedQuestion(BaseModel):
    question_text: str
    marks: Optional[int] = 5
    topic: Optional[str] = "General"
    bloom_level: Optional[str] = "Understand"
    question_type: Optional[str] = "Short Answer"

class QuestionPaperUpload(BaseModel):
    subject: str
    subject_code: Optional[str] = ""
    year: int = 2024
    semester: Optional[str] = "Semester 5"
    university: str
    raw_text: Optional[str] = ""
    parsed_questions: List[ParsedQuestion] = []

class PredictRequest(BaseModel):
    subject: str
    syllabus_topics: List[str] = []
    past_questions: List[str] = []
    target_university: Optional[str] = "General University"
    exam_type: Optional[str] = "End Semester Exam"

class PredictedQuestionItem(BaseModel):
    id: str
    question: str
    topic: str
    type: str  # "Short Answer" | "Long Essay" | "Numerical / Problem"
    probability: str  # "High" | "Medium" | "Crucial"
    confidence_score: float  # e.g., 0.92
    bloom_taxonomy: str  # "Remember" | "Understand" | "Apply" | "Analyze"
    key_concepts: List[str] = []
    model_solution_outline: str

class AgentTraceStep(BaseModel):
    agent: str
    status: str
    duration_ms: int
    summary: str
    details: Dict[str, Any] = {}

class PredictResponse(BaseModel):
    status: str
    subject: str
    analysis_summary: str
    topic_weights: Dict[str, int] = {}
    bloom_distribution: Dict[str, int] = {}
    predictions: List[PredictedQuestionItem] = []
    agent_trace: List[AgentTraceStep] = []

class AgentLog(BaseModel):
    user_email: str
    action: str
    subject: Optional[str] = ""
    execution_time_ms: int = 0
    trace: List[Dict[str, Any]] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)
