# Project Data Schema

## Core Entities

### User
```json
{
  "id": "uuid",
  "email": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "subscription_tier": "free|premium|enterprise"
}
```

### Resume
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "original_filename": "string",
  "parsed_data": {
    "personal_info": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "linkedin": "string"
    },
    "experience": [
      {
        "company": "string",
        "title": "string",
        "duration": "string",
        "bullets": ["string"]
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "year": "string"
      }
    ],
    "skills": ["string"],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string"]
      }
    ]
  },
  "created_at": "timestamp"
}
```

### JobAnalysis
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "job_description": "string",
  "requirements": {
    "required_skills": ["string"],
    "preferred_skills": ["string"],
    "experience_level": "string",
    "technologies": ["string"],
    "responsibilities": ["string"]
  },
  "created_at": "timestamp"
}
```

### GapAnalysis
```json
{
  "id": "uuid",
  "resume_id": "uuid",
  "job_analysis_id": "uuid",
  "gaps": {
    "missing_skills": ["string"],
    "skill_gaps": [
      {
        "skill": "string",
        "confidence": "float",
        "priority": "high|medium|low"
      }
    ],
    "project_opportunities": [
      {
        "type": "string",
        "description": "string",
        "technologies": ["string"],
        "complexity": "beginner|intermediate|advanced"
      }
    ]
  },
  "match_score": "float",
  "created_at": "timestamp"
}
```

### GeneratedProject
```json
{
  "id": "uuid",
  "gap_analysis_id": "uuid",
  "project_data": {
    "name": "string",
    "description": "string",
    "technologies": ["string"],
    "duration": "string",
    "achievements": ["string"],
    "challenges": ["string"],
    "github_url": "string (optional)"
  },
  "approval_status": "pending|approved|rejected",
  "created_at": "timestamp"
}
```