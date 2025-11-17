from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any
import pandas as pd
import json
import io
from app.services.database_service import DatabaseService
from app.database.models import Dataset
from app.services.walrus_service import WalrusService

router = APIRouter(prefix="/dataset", tags=["dataset"])

# Initialize services
db_service = DatabaseService()
walrus_service = WalrusService()

def validate_csv_content(content: str) -> Dict[str, Any]:
    """Validate CSV content and return validation results"""
    try:
        # Read CSV content
        df = pd.read_csv(io.StringIO(content))
        
        result = {
            "isValid": True,
            "rowCount": len(df),
            "columnCount": len(df.columns),
            "dataType": "CSV",
            "columns": df.columns.tolist(),
            "errors": []
        }
        
        # Check for empty dataframe
        if df.empty:
            result["isValid"] = False
            result["errors"].append("Dataset is empty")
            return result
            
        # Check for minimum columns
        if len(df.columns) < 2:
            result["isValid"] = False
            result["errors"].append("Dataset must have at least 2 columns")
            
        # Check for missing values
        missing_data = df.isnull().sum().sum()
        if missing_data > 0:
            result["errors"].append(f"Dataset contains {missing_data} missing values")
            
        return result
        
    except Exception as e:
        return {
            "isValid": False,
            "errors": [f"Failed to parse CSV: {str(e)}"]
        }

def validate_json_content(content: str) -> Dict[str, Any]:
    """Validate JSON content and return validation results"""
    try:
        data = json.loads(content)
        
        if not isinstance(data, list):
            return {
                "isValid": False,
                "errors": ["JSON data must be an array"]
            }
            
        if len(data) == 0:
            return {
                "isValid": False,
                "errors": ["JSON array is empty"]
            }
            
        # Check if all items are dictionaries
        non_dict_items = [item for item in data if not isinstance(item, dict)]
        if non_dict_items:
            return {
                "isValid": False,
                "errors": [f"Found {len(non_dict_items)} non-object items in array"]
            }
            
        # Get column names from first item
        if data:
            columns = list(data[0].keys()) if isinstance(data[0], dict) else []
        else:
            columns = []
            
        return {
            "isValid": True,
            "rowCount": len(data),
            "columnCount": len(columns),
            "dataType": "JSON",
            "columns": columns,
            "errors": []
        }
        
    except json.JSONDecodeError as e:
        return {
            "isValid": False,
            "errors": [f"Invalid JSON format: {str(e)}"]
        }
    except Exception as e:
        return {
            "isValid": False,
            "errors": [f"Failed to process JSON: {str(e)}"]
        }

@router.post("/validate")
async def validate_dataset(file: UploadFile = File(...)):
    """Validate an uploaded dataset file"""
    try:
        # Read file content
        content = (await file.read()).decode('utf-8')
        await file.seek(0)  # Reset file pointer for further processing
        
        # Determine file type and validate
        filename = file.filename or ""
        if filename.lower().endswith('.csv'):
            validation_result = validate_csv_content(content)
        elif filename.lower().endswith('.json'):
            validation_result = validate_json_content(content)
        else:
            # Try to detect file type
            if content.strip().startswith('[') or content.strip().startswith('{'):
                validation_result = validate_json_content(content)
            elif ',' in content:
                validation_result = validate_csv_content(content)
            else:
                validation_result = {
                    "isValid": False,
                    "errors": ["Unsupported file format. Please upload CSV or JSON files."]
                }
        
        return JSONResponse(content={
            "success": True,
            "filename": filename,
            "size": len(content),
            "validation": validation_result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to validate dataset: {str(e)}")

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload and validate a dataset file"""
    try:
        # Read file content
        content = (await file.read()).decode('utf-8')
        
        # Validate the dataset
        filename = file.filename or ""
        if filename.lower().endswith('.csv'):
            validation_result = validate_csv_content(content)
        elif filename.lower().endswith('.json'):
            validation_result = validate_json_content(content)
        else:
            # Try to detect file type
            if content.strip().startswith('[') or content.strip().startswith('{'):
                validation_result = validate_json_content(content)
            elif ',' in content:
                validation_result = validate_csv_content(content)
            else:
                validation_result = {
                    "isValid": False,
                    "errors": ["Unsupported file format. Please upload CSV or JSON files."]
                }
        
        # If validation failed, return error
        if not validation_result["isValid"]:
            return JSONResponse(content={
                "success": False,
                "error": "Validation failed: " + "; ".join(validation_result["errors"])
            })
        
        # Upload dataset to Walrus
        content_bytes = content.encode('utf-8')
        cid = await walrus_service.upload_blob(
            content_bytes,
            {
                "filename": filename,
                "content_type": file.content_type,
                "size": len(content_bytes)
            }
        )
        
        # Store dataset information in database
        dataset_info = Dataset(
            filename=filename,
            size=len(content),
            cid=cid,
            validation=validation_result,
            uploaded_by="default_contributor",  # In a real implementation, this would come from auth
            content_type=file.content_type
        )
        
        dataset_id = db_service.create_dataset(dataset_info)
        
        return JSONResponse(content={
            "success": True,
            "dataset_id": dataset_id,
            "cid": cid,
            "filename": filename,
            "size": len(content),
            "validation": validation_result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload dataset: {str(e)}")