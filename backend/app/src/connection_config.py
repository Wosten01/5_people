import os
from dotenv import load_dotenv

load_dotenv()

connection_params = {
    "dbname": os.getenv("DBNAME"),
    "user":  os.getenv("DBUSER"),
    "password":  os.getenv("PSWD"),
    "host":  os.getenv("HOST"),
    "port":  os.getenv("PORT"),
}