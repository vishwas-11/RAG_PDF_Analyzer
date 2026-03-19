from fastapi import APIRouter, HTTPException
import bcrypt

from models.auth_model import AuthModel
from db.mongo import users_collection
from core.security import create_access_token

router = APIRouter()


@router.post("/signup")
async def signup(user: AuthModel):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    users_collection.insert_one({
        "email": user.email,
        "password": hashed
    })

    return {"message": "Success"}


@router.post("/login")
async def login(user: AuthModel):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": user.email
    }