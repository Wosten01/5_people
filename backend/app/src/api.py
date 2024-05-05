# src/api.py

from typing import Annotated

from fastapi import FastAPI, Body, Depends, File, UploadFile, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import HTMLResponse

from model import PostSchema, UserSchema, UserLoginSchema, UserMap, ReportSchema, ModerConfirm, Area, ModerCancel, UserReport
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT
from connection_config import connection_params

import base64
import psycopg2
import psycopg2.extras
import hashlib
import shutil
import os
import uuid
import folium

origins = [
    "*"
]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)



@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your blog!"}

    
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
        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email, )
        )
        user_id = cursor.fetchone()[0]
        cursor.execute(
            "INSERT INTO achievements "
            "(reports, completes, user_id) "
            "VALUES (%s, %s, %s)",
            (0, 0, user_id),
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

@app.post("/report", tags=["user"])
# @app.post("/report", dependencies=[Depends(JWTBearer())], tags=["user"])
async def report(img: UploadFile = File(...), text = Form(...), geo = Form(...), user_id = Form(...)):
    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_ext = os.path.splitext(img.filename)[1]
    
    random_filename = str(uuid.uuid4())
    file_path = os.path.join(upload_folder, random_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(img.file, buffer)
    
    with open(file_path, "rb") as file:
        hashed_filename = hashlib.sha256(file.read()).hexdigest()
        
    
    hash_img = f"{hashed_filename}{file_ext}"
    
    final_file_path = os.path.join(upload_folder, hash_img)
    os.rename(file_path, final_file_path)
    
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO requests "
            "(text, geo, img, status, user_id, value) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (text, geo, hash_img, 0, int(user_id), 0),
        )
        return {"message": "Report registered successfully"}, 201

@app.post("/report/base64", tags=["user"])
async def report2(img = Form(...), text = Form(...), geo = Form(...), user_id = Form(...)):
    binary_data = base64.b64decode(img)
    
    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_ext = ".jpeg"
    
    random_filename = str(uuid.uuid4())
    file_path = os.path.join(upload_folder, random_filename)
    
    with open(file_path, "wb") as file:
        file.write(binary_data)
    
    with open(file_path, "rb") as file:
        hashed_filename = hashlib.sha256(file.read()).hexdigest()
        
    
    hash_img = f"{hashed_filename}{file_ext}"
    
    final_file_path = os.path.join(upload_folder, hash_img)
    os.rename(file_path, final_file_path)
    
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO requests "
            "(text, geo, img, status, user_id, value) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (text, geo, hash_img, 0, int(user_id), 0),
        )
        return {"message": "Report registered successfully"}, 201
    

@app.get("/report/{id}", tags=["user"])
async def get_single_report(id: int) -> dict:
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT text, geo, img, status, user_id, value, img_clean FROM requests WHERE id = %s",
            (str(id), )
        )
        picker_list = []
        for row in cursor.fetchall():
            report_data = {
                "text": row[0],
                "geo": row[1],
                "img": row[2],
                "status": row[3],
                "user_id": row[4],
                "value": row[5],
                "img_clean": row[6]
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

@app.post("/confirm_report", tags=["moder"])
async def confirm_report(data: ModerConfirm):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = %s, value = %s WHERE id = %s",
            (1, data.value, data.report_id,)
        )
    content = {"message": "Status changed"}
    
    return content 


@app.post("/close_report", tags=["moder"])
async def close_report(report_id: int, cleaner_id: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, value FROM requests WHERE id = %s",
            (str(report_id), )
        )
        for row in cursor.fetchall():
            user_id = row[0]
            value = row[1]
        cursor.execute(
            "UPDATE users SET rank = rank + %s WHERE id = %s",
            (value, user_id, )
        )
        cursor.execute(
            "UPDATE users SET rank = rank + %s WHERE id = %s",
            (value, cleaner_id, )
        )
        cursor.execute(
            "UPDATE achievements SET reports = reports + 1 WHERE id = %s",
            (user_id, )
        )
        cursor.execute(
            "UPDATE achievements SET completes = completes + 1 WHERE id = %s",
            (cleaner_id, )
        )
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = %s WHERE id = %s",
            (3, report_id)
        )
    content = {"message": "Status changed"}
    return content 

@app.get("/pickers", tags=["user"])
async def pickers():
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, text, geo, img, status, value FROM requests WHERE status = 1"
        )
        picker_list = []
        for row in cursor.fetchall():
            report_data = {
                "id": row[0],
                "text": row[1],
                "geo": row[2],
                "status": row[4],
                "value": row[5],
            }
            picker_list.append(report_data)    
    response = {"data": picker_list}
    return response

@app.get("/user/pickers", tags=["user"])
async def user_pickers(id: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, text, geo, img, status, value FROM requests WHERE user_id = %s",
            (id, )
        )
        picker_list = []
        for row in cursor.fetchall():
            with open("uploads/" + row[3], "rb") as file:
                image_data = file.read()
                image_base64 = base64.b64encode(image_data).decode("utf-8")
            report_data = {
                "id": row[0],
                "text": row[1],
                "geo": row[2],
                "status": row[4],
                "value": row[5],
                "img" : image_base64
            }
            picker_list.append(report_data)    
    response = {"data": picker_list}
    return response

@app.post("/moder/pickers", tags=["moder"])
async def moder_pickers():
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, text, geo, img, status, user_id, value, img_clean FROM requests WHERE status < 4"
        )
        picker_list = []
        for row in cursor.fetchall():
            # with open("uploads/" + row[3], "rb") as file:
            #     image_data = file.read()
            #     image_base64 = base64.b64encode(image_data).decode("utf-8")
            report_data = {
                "id": row[0],
                "text": row[1],
                "geo": row[2],
                # "img": image_base64,
                "img": row[3],
                "status": row[4],
                "user_id": row[5],
                "value": row[6],
                "img_clean": row[7]
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
        cursor.execute(
            "SELECT reports, completes FROM achievements WHERE user_id = %s",
            (id, )
        )
        for row in cursor.fetchall():
            achievements = {
                "reports": row[0],
                "completes": row[1],
            }  
    response = {"data": user_data, 
                "achievements" : achievements}
    return response
    
# на будущее
@app.get("/map", tags=["user"],  response_class=HTMLResponse)
async def get_map(data: Area):
    m = folium.Map(location=[data.latitude, data.longitude], zoom_start=5)
    
    folium.Marker([data.latitude, data.longitude], popup='Report Marker').add_to(m)
    
    m.save("map.html")
    
    with open("map.html", "r") as f:
        map_html = f.read()
    
    return {"map_html": map_html}

@app.get("/area", tags=["user"])
async def get_area(data: Area):
    area = []
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, geo FROM requests CROSS JOIN (SELECT %s AS target_x, %s AS target_y) AS target_coords CROSS JOIN LATERAL (SELECT geo_split[1]::float AS x, geo_split[2]::float AS y FROM regexp_split_to_array(geo, ' ') AS geo_split) AS parsed_coords WHERE ABS(parsed_coords.x - target_coords.target_x) <= 1 AND ABS(parsed_coords.y - target_coords.target_y) <= 1;",
                       (data.latitude, data.longitude,)
        )
    for row in cursor.fetchall():
        geo = row[1].split(' ')
        area.append ({
            "id": row[0],
            "x": geo[0],
            "y": geo[1],
        })
    
    response = {"area": area}
    return response
#######

@app.get("/top", tags=["user"])
async def top():
    top_users = []
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, fio, rank FROM users ORDER BY rank DESC LIMIT 10;")
        for row in cursor.fetchall():
            user_data = {
                "id": row[0],
                "fio": row[1],
                "rank": row[2]
            }
            top_users.append(user_data)
    
    return {"top_users": top_users}

@app.get("/rank", tags=["user"])
async def rank(id: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            WITH ranked_users AS (
                SELECT id, rank,
                       ROW_NUMBER() OVER (ORDER BY rank DESC) AS position
                FROM users
            )
            SELECT position
            FROM ranked_users
            WHERE id = %s;
        """, (id,))
        
        position = cursor.fetchone()
        if position:
            return {"position": position[0]}
       
@app.get("/history", tags=["user"])
async def history(id: int):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT reports, completes FROM achievements WHERE id = %s",
            (id, )
        )
        for row in cursor.fetchall():
            user_data = {
                "reports": row[0],
                "completes": row[1],
            }   
    response = {"data": user_data}
    return response

@app.post("/cancel_report", tags=["moder"])
async def cancel_report(data: ModerCancel):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = 4 WHERE id = %s",
            (data.report_id,)
        )
    content = {"message": "Status changed"}
    return content 

@app.get("/image", tags=["user"])
async def get_image(img: str):
    with open("uploads/" + img, "rb") as file:
        image_data = file.read()

    return Response(content=image_data, media_type="image/jpeg")



@app.post("/user_confirm", tags=["user"])
async def confirm_report(report_id: int):
    
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = %s WHERE id = %s",
            (2, report_id,)
        )
    content = {"message": "Status changed"}
    
    return content 

@app.post("/user_confirm/base64", tags=["user"])
async def user_confirm2(img = Form(...), report_id = Form(...)):
    report_id = int(report_id)
    binary_data = base64.b64decode(img)
    
    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_ext = ".jpeg"
    
    random_filename = str(uuid.uuid4())
    file_path = os.path.join(upload_folder, random_filename)
    
    with open(file_path, "wb") as file:
        file.write(binary_data)
    
    with open(file_path, "rb") as file:
        hashed_filename = hashlib.sha256(file.read()).hexdigest()
        
    
    hash_img = f"{hashed_filename}{file_ext}"
    
    final_file_path = os.path.join(upload_folder, hash_img)
    os.rename(file_path, final_file_path)
    
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = %s, img_clean = %s WHERE id = %s",
            (2, hash_img, report_id,)
        )
    content = {"message": "Status changed"}
    
    return content 

@app.post("/decline_report", tags=["moder"])
async def cancel_report(data: ModerCancel):
    with psycopg2.connect(**connection_params) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE requests SET status = status - 1 WHERE id = %s",
            (data.report_id,)
        )
    content = {"message": "Status changed"}
    return content 