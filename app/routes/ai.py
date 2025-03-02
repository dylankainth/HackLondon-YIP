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


@router.post("/compare")
async def compare_users(reqdata: Request):
    data = await reqdata.json()
    data = data['room']
    print(data)
    if len(data) != 2:
        return {"winner": 0, "reason": "Invalid data"}
    
    
    userdata1 = f"{'\n'.join((str(datetime.datetime.fromtimestamp(int(item['time'])//1000).strftime('%H:%M'))+' : '+item['text'] for item in data[0]['progress']))}"
    userdata2 = f"{'\n'.join((str(datetime.datetime.fromtimestamp(int(item['time'])//1000).strftime('%H:%M'))+' : '+item['text'] for item in data[1]['progress']))}"
    print("userdata1: ",userdata1)
    print("userdata2: ",userdata2)
    reasoning,idx = compare_performance(userdata1, userdata2)
    winner = "Nobody"
    if idx == 1:
        winner = data[0]['nickname']
    elif idx == 2:
        winner = data[1]['nickname']
        
    print("winner:",winner)
    print(reasoning)
    return {"winner": winner, "reason": reasoning.strip()}