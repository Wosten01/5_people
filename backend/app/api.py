# app/api.py

from typing import Annotated

from fastapi import FastAPI, Body, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.model import PostSchema, UserSchema, UserLoginSchema, UserMap, ReportSchema
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signJWT
from app.connection_config import connection_params

import psycopg2
import psycopg2.extras
import hashlib
import shutil
import os
import copy 
import folium

posts = [
    {
        "id": 1,
        "title": "Pancake",
        "content": "Lorem Ipsum ..."
    }
]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your blog!"}


@app.get("/posts", tags=["posts"])
async def get_posts() -> dict:
    return { "data": posts }


@app.get("/posts/{id}", tags=["posts"])
async def get_single_post(id: int) -> dict:
    if id > len(posts):
        return {
            "error": "No such post with the supplied ID."
        }

    for post in posts:
        if post["id"] == id:
            return {
                "data": post
            }


@app.post("/posts", dependencies=[Depends(JWTBearer())], tags=["posts"])
async def add_post(post: PostSchema) -> dict:
    post.id = len(posts) + 1
    posts.append(post.dict())
    return {
        "data": "post added."
    }
    
@app.post("/user/signup", tags=["user"])
async def create_user(user: UserSchema = Body(...)):
    fio = user.fullname
    email = user.email
    password = user.password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users "
            "(fio, password, rank, email) "
            "VALUES (%s, %s, %s, %s)",
            (fio, hashed_password, 0, email),
        )
        return {"message": "User registered successfully",
                "username": fio}, 201
    return signJWT(user.email)


def check_user_exists(data: UserLoginSchema):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        hashed_password = hashlib.sha256(data.password.encode()).hexdigest()
    
        cursor.execute(
            "SELECT COUNT(*) FROM users WHERE email = %s AND password = %s",
            (data.email, hashed_password),
        )
        count = cursor.fetchone()[0]
        if count == 1:
            return True
        else:
            return False

@app.post("/user/login", tags=["user"])
async def user_login(user: UserLoginSchema = Body(...)):
    if check_user_exists(user):
        content = {"message": "TOKEN IS BACK"}
        response = JSONResponse(content=content)
        response.set_cookie(key="token", value=signJWT(user.email)["access_token"])
        return response
    return {
        "error": "Wrong login details!"
    }

@app.post("/report", dependencies=[Depends(JWTBearer())], tags=["user"])
async def report(img: UploadFile = File(...), text = Form(...), geo = Form(...), user_id = Form(...)):
    print("YES")
    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        
    file = copy.deepcopy(img.file)
    
    hashed_filename = hashlib.file_digest(file, "sha256").hexdigest()
    file_ext = os.path.splitext(img.filename)[1]
    hash_img = f"{hashed_filename}{file_ext}"
    file_path = os.path.join(upload_folder, hash_img)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(img.file, buffer)
    
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO requests "
            "(text, geo, img, status, user_id) "
            "VALUES (%s, %s, %s, %s, %s)",
            (text, geo, hash_img, 0, int(user_id)),
        )
        return {"message": "Report registered successfully"}, 201
    

@app.get("/report/{id}", tags=["user"])
async def get_single_report(id: int) -> dict:
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, text, geo, img, status, user_id FROM requests WHERE id = %s",
            (str(id), )
        )
        picker_list = []
        for row in cursor.fetchall():
            report_data = {
                "id": row[0],
                "text": row[1],
                "geo": row[2],
                "img": row[3],
                "status": row[4],
                "user_id": row[5]
            }
            picker_list.append(report_data)    
    response = {"data": picker_list}
    return response
    
@app.post("/change_status", tags=["moder"])
async def change_status(report_id: int, status: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = %s WHERE id = %s",
            (status, report_id)
        )
        if cursor.rowcount == 1:
            content = {"message": "Status changed"}
        else:
            content =  {"message": f"No report found with id {report_id}"}, 404
    return content 

@app.post("/close_report", tags=["moder"])
async def close_report(report_id: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id FROM requests WHERE id = %s",
            (str(report_id), )
        )
        user_id = cursor.fetchone()[0]
        cursor.execute(
            "UPDATE users SET rank = rank + 1 WHERE id = %s",
            (user_id, )
        )
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = %s WHERE id = %s",
            (3, report_id)
        )
    content = {"message": "Status changed"}
    return content 


@app.post("/user/pickers", tags=["user"])
async def user_pickers(id: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, text, geo, img, status, user_id FROM requests WHERE user_id = %s",
            (str(id))
        )
        picker_list = []
        for row in cursor.fetchall():
            report_data = {
                "id": row[0],
                "text": row[1],
                "geo": row[2],
                "img": row[3],
                "status": row[4],
                "user_id": row[5]
            }
            picker_list.append(report_data)    
    response = {"data": picker_list}
    return response


@app.post("/moder/pickers", tags=["moder"])
async def moder_pickers():
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, text, geo, img, status, user_id FROM requests WHERE status = 0 OR status = 2"
        )
        picker_list = []
        for row in cursor.fetchall():
            report_data = {
                "id": row[0],
                "text": row[1],
                "geo": row[2],
                "img": row[3],
                "status": row[4],
                "user_id": row[5]
            }
            picker_list.append(report_data)    
    response = {"data": picker_list}
    return response

@app.get("/profile/{id}", tags=["user"])
async def profile(id: int) -> dict:
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT fio, email, rank FROM users WHERE id = %s",
            (id, )
        )
        for row in cursor.fetchall():
            user_data = {
                "fio": row[0],
                "email": row[1],
                "rank": row[2],
            }   
    response = {"data": user_data}
    return response
    
@app.get("/map", tags=["user"])
async def get_map(latitude: float, longitude: float):
    m = folium.Map(location=[latitude, longitude], zoom_start=15)
    
    folium.Marker([latitude, longitude], popup='Report Marker').add_to(m)
    
    m.save("map.html")
    
    with open("map.html", "r") as f:
        map_html = f.read()
    
    return {"map_html": map_html}