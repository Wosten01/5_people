# app/model.py

from pydantic import BaseModel, Field, EmailStr
from fastapi import Form

class PostSchema(BaseModel):
    id: int = Field(default=None)
    title: str = Field(...)
    content: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "title": "Securing FastAPI applications with JWT.",
                "content": "In this tutorial, you'll learn how to secure your application by enabling authentication using JWT. We'll be using PyJWT to sign, encode and decode JWT tokens...."
            }
        }

class UserSchema(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Smetankin Nikita Artivich",
                "email": "nikita@gmail.com",
                "password": "nikita"
            }
        }

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "email": "nikita@gmail.com",
                "password": "nikita"
            }
        }

class UserMap(BaseModel):
    zone: list = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "zone": "All"
            }
        }


class ReportSchema(BaseModel):
    text: str = Form(...)
    geo: str = Form(...)
    user_id: int = Form(...)

    class Config:
        schema_extra = {
            "example": {
                "text": "Abdulazeez Abdulazeez Adeshina",
                "geo": "42.123, 23.234543",
                "user_id": 1
            }
        }