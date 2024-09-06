
from supabase import create_client, Client
from dotenv import load_dotenv, dotenv_values
import os

import json

# Creating Client

load_dotenv()

url: str = os.getenv("SUPABASE_PROJECT_URL")
key: str = os.getenv("SUPABASE_PRIVATE_KEY")

supabase: Client = create_client(url, key)

# Function gets all the rows from the table and returns it
def SupabaseGetAllRows() -> json:
    response = supabase.table('pdf_files').select('*').execute()
    return response 

# Function that uploads metadata to Supabase SQL database and returns true or false
def SupabaseUploadMetadata(filename: str, nickname: str, priority: str = None) -> json:
    response = supabase.table("pdf_files").insert(
        {
            "filename": filename,
            "nickname": nickname,
            "priority": priority
        }).execute()
    return response 

# Function deletes row from the SQL database, and deletes it from bucket
def SupabaseDeleteFromTable(pdf_id: str):
    response = supabase.table("pdf_files").delete().eq("pdf_id", pdf_id).execute()
    return response

def SupabaseDeleteFromBucket(file_name: str):
    response = supabase.storage.from_("PDF_Files_Bucket").remove(file_name)
    return response