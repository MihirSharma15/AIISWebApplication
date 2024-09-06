from fastapi import FastAPI
from supabase_utils import *
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class File(BaseModel):
    filename: str
    nickname: str
    priority: str

class PDFUUID(BaseModel):
    pdf_id: str

class DELETEFILE(BaseModel):
    filename: str

@app.get("/")
async def root():
    return {"message": "No Path Selected"}

@app.get("/api/getallrows")
async def getallrows():
    data = SupabaseGetAllRows()
    return data

@app.post("/api/uploadmetadata")
async def uploadtmetadata(file: File):
    data = SupabaseUploadMetadata(file.filename, file.nickname, file.priority)
    return data

# takes in JSON
@app.post("/api/delete/table/")
async def deletefilefromtable(pdf_id: PDFUUID):
    data = SupabaseDeleteFromTable(pdf_id.pdf_id)
    return data

@app.post("/api/delete/bucket/")
async def deletefilefrombucket(file_name: DELETEFILE):
    data = SupabaseDeleteFromBucket(file_name.filename)
    return data

# Yay!

