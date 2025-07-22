"""Diagnose OpenAI API issues"""
from openai import OpenAI
from app.core.config import settings

def diagnose_openai():
    """Diagnose OpenAI API connection and quota issues"""
    
    if not settings.OPENAI_API_KEY:
        print("ERROR: No OpenAI API key found in .env file")
        return
    
    print(f"API Key found: {settings.OPENAI_API_KEY[:10]}...{settings.OPENAI_API_KEY[-4:]}")
    
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Try a minimal API call
        print("Testing minimal OpenAI API call...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Try cheaper model first
            messages=[{"role": "user", "content": "Say 'API working'"}],
            max_tokens=10
        )
        
        print("SUCCESS: OpenAI API is working!")
        print(f"Response: {response.choices[0].message.content}")
        
        # Now try GPT-4o
        print("Testing GPT-4o model...")
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "Say 'GPT-4o working'"}],
            max_tokens=10
        )
        
        print("SUCCESS: GPT-4o model is working!")
        print(f"Response: {response.choices[0].message.content}")
        
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR: {error_msg}")
        
        if "insufficient_quota" in error_msg:
            print("\nSOLUTION: Your OpenAI account needs billing setup or credits added")
            print("1. Go to https://platform.openai.com/settings/organization/billing")
            print("2. Add a payment method or purchase credits")
            print("3. Check your usage at https://platform.openai.com/usage")
            
        elif "invalid_api_key" in error_msg:
            print("\nSOLUTION: Invalid API key")
            print("1. Check your API key at https://platform.openai.com/api-keys")
            print("2. Make sure it's copied correctly to .env file")
            
        elif "rate_limit" in error_msg:
            print("\nSOLUTION: Rate limit exceeded")
            print("1. Wait a few minutes and try again")
            print("2. Consider upgrading your OpenAI plan")

if __name__ == "__main__":
    diagnose_openai()