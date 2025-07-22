from fastapi import FastAPI, Request, Response
import logging
from app.api import health, auth, resumes, job_analysis, gap_analysis, project_generation, resume_optimization, realtime_optimization
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Resume AI API",
    description="AI-powered resume optimization and project generation",
    version="1.0.0",
)

@app.on_event("startup")
async def startup_event():
    logger.info("===== Resume AI API Starting Up =====")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Database URL: {settings.DATABASE_URL}")
    logger.info("===== Startup Complete =====")

# Add request logging middleware
@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    logger.info(f"🔥 REQUEST: {request.method} {request.url}")
    logger.info(f"🔥 Headers: {dict(request.headers)}")
    
    try:
        response = await call_next(request)
        logger.info(f"🔥 RESPONSE: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"🔥 MIDDLEWARE ERROR: {str(e)}")
        logger.error(f"🔥 ERROR TYPE: {type(e)}")
        import traceback
        logger.error(f"🔥 TRACEBACK: {traceback.format_exc()}")
        raise

# Add manual CORS middleware for better control
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    response = await call_next(request)
    
    # Set CORS headers manually
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Max-Age"] = "86400"
    
    return response

# Handle preflight OPTIONS requests
@app.options("/{full_path:path}")
async def preflight_handler(request: Request, full_path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",
        }
    )

# Include routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(resumes.router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(job_analysis.router, prefix="/api/v1/job-analysis", tags=["job-analysis"])
app.include_router(gap_analysis.router, prefix="/api/v1/gap-analysis", tags=["gap-analysis"])
app.include_router(project_generation.router, prefix="/api/v1/projects", tags=["project-generation"])
app.include_router(resume_optimization.router, prefix="/api/v1/resume-optimization", tags=["resume-optimization"])
app.include_router(realtime_optimization.router, prefix="/api/v1/realtime", tags=["realtime-optimization"])

@app.get("/")
async def root():
    return {"message": "Resume AI API is running", "debug": "NEW CODE LOADED"}

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS test successful", "timestamp": "2025-01-18"}

@app.post("/debug-test")
async def debug_test():
    print("DEBUG: Test endpoint called!")
    return {"message": "Debug test successful"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)