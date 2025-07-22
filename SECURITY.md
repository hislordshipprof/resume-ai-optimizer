# 🔐 Security Guidelines - Resume AI

## Overview
This document outlines security best practices and guidelines for the Resume AI project. Given that we handle sensitive user data (resumes, personal information), security is paramount.

## 🚨 **CRITICAL - Never Commit These Files**

### **Immediate Security Risks:**
```bash
# Environment files with secrets
.env
backend/.env
profile-enhancement-suite/.env

# API keys and tokens
**/secrets/
**/*secret*
**/*key*
**/*token*

# Database credentials
database.url
db_credentials.*
connection_string.*

# Authentication certificates
*.pem
*.key
*.cert
*.crt
```

## 🔑 **Environment Variables Security**

### **Backend Secrets (.env):**
```bash
# CRITICAL - Must be secure in production
SECRET_KEY="generate-a-strong-256-bit-key"
OPENAI_API_KEY="sk-your-actual-openai-key"
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="another-strong-secret-key"

# Database credentials
DB_USER="secure_username"
DB_PASSWORD="strong_database_password"

# Email credentials (if used)
SMTP_PASSWORD="app-specific-password"
```

### **Security Best Practices:**
1. **Use strong, unique keys** for each environment
2. **Rotate keys regularly** (monthly for development, weekly for production)
3. **Use secrets management** services in production (AWS Secrets Manager, Azure Key Vault)
4. **Never share .env files** via email, Slack, or other channels

## 🛡️ **Data Protection**

### **Personal Information Handling:**
```typescript
// User data we handle:
interface SensitiveData {
  personalInfo: {
    name: string;           // PII
    email: string;          // PII
    phone: string;          // PII
    linkedin: string;       // PII
    location: string;       // PII
  };
  resumeContent: string;    // Highly sensitive career information
  jobApplications: string; // Professional aspirations
}
```

### **Data Security Measures:**
1. **Encryption at rest** - All database data encrypted
2. **Encryption in transit** - HTTPS/TLS for all communications
3. **Minimal data retention** - Auto-delete uploaded files after processing
4. **Access controls** - User-specific data isolation
5. **Audit logging** - Track all data access and modifications

## 🔐 **Authentication & Authorization**

### **JWT Token Security:**
```typescript
// Token configuration
{
  algorithm: "HS256",
  expiresIn: "30m",        // Short-lived access tokens
  refreshExpiresIn: "7d",  // Longer refresh tokens
  issuer: "resume-ai",
  audience: "resume-ai-users"
}
```

### **Security Measures:**
1. **Short token expiration** (30 minutes for access tokens)
2. **Secure token storage** (httpOnly cookies in production)
3. **Token rotation** on each refresh
4. **Proper logout** (token invalidation)
5. **Rate limiting** on authentication endpoints

## 🌐 **API Security**

### **Input Validation:**
```python
# All API endpoints must validate input
from pydantic import BaseModel, validator
from typing import List, Optional

class SecureResumeUpload(BaseModel):
    file_size: int
    file_type: str
    
    @validator('file_size')
    def validate_file_size(cls, v):
        if v > 10_485_760:  # 10MB
            raise ValueError('File too large')
        return v
    
    @validator('file_type')
    def validate_file_type(cls, v):
        allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        if v not in allowed:
            raise ValueError('Invalid file type')
        return v
```

### **Security Headers:**
```python
# FastAPI security headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
```

## 🗄️ **Database Security**

### **Connection Security:**
```python
# Secure database configuration
DATABASE_CONFIG = {
    "sslmode": "require",           # Force SSL
    "connect_timeout": 10,          # Timeout connections
    "command_timeout": 30,          # Timeout queries
    "pool_size": 5,                 # Limit connections
    "max_overflow": 10,             # Prevent connection exhaustion
}
```

### **Data Protection:**
1. **Parameterized queries** - Prevent SQL injection
2. **Minimal permissions** - Database user with restricted access
3. **Regular backups** - Encrypted and versioned
4. **Data anonymization** - For development/testing environments

## 🔍 **File Upload Security**

### **Upload Validation:**
```python
import magic
from pathlib import Path

async def secure_file_upload(file: UploadFile):
    # 1. File size validation
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large")
    
    # 2. File type validation (magic numbers)
    file_content = await file.read(1024)
    mime_type = magic.from_buffer(file_content, mime=True)
    
    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(400, "Invalid file type")
    
    # 3. Virus scanning (in production)
    # virus_scan_result = await scan_for_viruses(file_content)
    
    # 4. Sanitize filename
    safe_filename = secure_filename(file.filename)
    
    return safe_filename
```

### **File Storage:**
1. **Temporary storage** - Files deleted after processing
2. **Sandboxed processing** - Isolated file processing environment
3. **No executable permissions** - Uploaded files can't be executed
4. **Virus scanning** - Production environments should scan uploads

## 🤖 **AI Service Security**

### **OpenAI API Security:**
```python
# Secure AI API calls
async def secure_ai_request(prompt: str, user_id: str):
    # 1. Input sanitization
    sanitized_prompt = sanitize_prompt(prompt)
    
    # 2. Rate limiting per user
    await check_rate_limit(user_id)
    
    # 3. Content filtering
    if contains_sensitive_content(sanitized_prompt):
        raise HTTPException(400, "Content not allowed")
    
    # 4. Secure API call
    response = await openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": sanitized_prompt}],
        max_tokens=2000,
        temperature=0.7,
        user=f"user_{user_id}"  # Track usage per user
    )
    
    return response
```

### **AI Security Measures:**
1. **Input sanitization** - Remove sensitive information before AI processing
2. **Output filtering** - Scan AI responses for inappropriate content
3. **Usage tracking** - Monitor API usage per user
4. **Cost controls** - Prevent excessive API usage
5. **Data minimization** - Send only necessary data to AI services

## 🚨 **Incident Response**

### **Security Incident Types:**
1. **Data breach** - Unauthorized access to user data
2. **API abuse** - Excessive or malicious API usage
3. **Authentication bypass** - Unauthorized access attempts
4. **File upload abuse** - Malicious file uploads
5. **AI prompt injection** - Attempts to manipulate AI responses

### **Response Procedures:**
1. **Immediate containment** - Stop the threat
2. **Assessment** - Determine scope and impact
3. **Notification** - Alert affected users and authorities if required
4. **Recovery** - Restore normal operations
5. **Lessons learned** - Update security measures

## 📋 **Security Checklist**

### **Before Each Deployment:**
- [ ] All secrets removed from code
- [ ] Environment variables properly configured
- [ ] Security headers implemented
- [ ] Input validation in place
- [ ] Rate limiting configured
- [ ] SSL/TLS certificates valid
- [ ] Database access restricted
- [ ] File upload limits enforced
- [ ] AI API usage monitored
- [ ] Logging and monitoring active

### **Regular Security Tasks:**
- [ ] Weekly: Review access logs
- [ ] Monthly: Rotate API keys
- [ ] Quarterly: Security audit
- [ ] Yearly: Penetration testing

## 🔗 **Security Resources**

### **Tools and Services:**
- **Static Code Analysis**: SonarQube, CodeQL
- **Dependency Scanning**: npm audit, safety (Python)
- **Secrets Detection**: GitLeaks, TruffleHog
- **Vulnerability Scanning**: OWASP ZAP, Nessus
- **Monitoring**: Sentry, DataDog, CloudWatch

### **Security Standards:**
- **OWASP Top 10** - Web application security risks
- **NIST Cybersecurity Framework** - Security guidelines
- **SOC 2** - Service organization controls
- **GDPR** - Data protection regulations

## 📞 **Security Contacts**

**Security Issues**: Report immediately to [security@resumeai.com]
**Data Breaches**: Follow incident response procedures
**Vulnerability Reports**: Submit through responsible disclosure process

---

**Remember: Security is everyone's responsibility. When in doubt, choose the more secure option.**