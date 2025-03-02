from fastapi import APIRouter, Request
from pydantic import BaseModel
import datetime
from typing import List
from app.services.gemini_service import summarize_activities, compare_performance

router = APIRouter()

class Activities(BaseModel):
    activities: List[str]

@router.post("/summary")
async def get_summary(reqdata: Request):
    data = await reqdata.json()
    data = data['text']

    print("raw: ",data)
    summary = summarize_activities(data)
    print("summary: ",summary)
    return {"summary": summary}
    

class CompareData(BaseModel):
    user1_activities: List[str]
    user2_activities: List[str]

@router.post("/compare")
async def compare_users(data: CompareData):
    text1 = ". ".join(data.user1_activities)
    text2 = ". ".join(data.user2_activities)
    comparison = compare_performance(text1, text2)
    return {"comparison": comparison}

class CompareData(BaseModel):
    user1_activities: List[str]
    user2_activities: List[str]