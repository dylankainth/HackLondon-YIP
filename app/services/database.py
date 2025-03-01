from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGO_URI)
db = client.virtual_accountability

# Define your collections (for example, activities)
activities_collection = db.activities
