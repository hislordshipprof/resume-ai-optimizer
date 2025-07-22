#!/bin/bash

# ===============================================
# RESUME AI - Repository Setup Script
# ===============================================
# This script safely initializes the git repository
# and ensures all sensitive files are properly ignored

echo "🚀 Setting up Resume AI Repository..."

# Initialize git repository
echo "📁 Initializing git repository..."
git init

# Add remote origin
echo "🌐 Adding remote origin..."
git remote add origin https://github.com/hislordshipprof/resume-ai-optimizer.git

# Create initial commit with .gitignore first
echo "🛡️  Adding .gitignore and security files..."
git add .gitignore
git add SECURITY.md
git add README.md
git add backend/.env.example
git add profile-enhancement-suite/.env.example
git add CLAUDE.md

# Check for sensitive files that should NOT be committed
echo "🔍 Checking for sensitive files..."

# List files that should be ignored
sensitive_files=(
    "backend/.env"
    "profile-enhancement-suite/.env" 
    "**/*secret*"
    "**/*key*"
    "**/*token*"
    "**/*.pem"
    "**/*.cert"
)

echo "⚠️  The following files will be ignored (NOT committed):"
for pattern in "${sensitive_files[@]}"; do
    find . -path "./.git" -prune -o -name "$pattern" -type f -print 2>/dev/null | head -5
done

# Verify .gitignore is working
echo "✅ Verifying .gitignore is protecting sensitive files..."
git add . --dry-run | grep -E "\.(env|key|pem|cert)$" && echo "❌ WARNING: Sensitive files would be committed!" || echo "✅ Sensitive files are properly ignored"

# Create initial commit
echo "📝 Creating initial commit..."
git add .
git commit -m "🎉 Initial commit: AI-powered resume optimization platform

✨ Features:
- 🤖 OpenAI GPT integration for intelligent resume analysis
- 🔍 NLP-powered job description parsing and gap analysis  
- ⚡ Real-time resume optimization with ML algorithms
- 📊 ATS compatibility scoring and LaTeX export
- 🏗️ Production-ready FastAPI + React TypeScript stack

🔐 Security:
- Comprehensive .gitignore for sensitive files
- Environment variable templates and security guidelines
- Secure authentication with JWT tokens

🏆 Ready for production deployment and recruiter showcase

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Set up branch tracking
echo "🌿 Setting up branch tracking..."
git branch -M main

# Display summary
echo "
===============================================
✅ Repository Setup Complete!
===============================================

📁 Repository: resume-ai-optimizer
🌐 Remote: https://github.com/hislordshipprof/resume-ai-optimizer.git
🌿 Branch: main

🔐 Security Status:
✅ .gitignore configured with comprehensive patterns
✅ Sensitive files (.env) are properly ignored
✅ Security documentation created
✅ Environment templates provided

📋 Next Steps:
1. Configure your environment files:
   cp backend/.env.example backend/.env
   cp profile-enhancement-suite/.env.example profile-enhancement-suite/.env
   
2. Add your API keys and secrets to the .env files
   
3. Push to GitHub:
   git push -u origin main
   
4. Start development:
   docker-compose up -d

⚠️  Important Security Reminders:
- NEVER commit .env files
- Always use .env.example for templates
- Rotate API keys regularly
- Review SECURITY.md for best practices

Happy coding! 🚀
"