from typing import Optional, Dict, Any
import openai
import os

class ChatBot:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
    async def get_response(self, message: str) -> str:
        """Get response from OpenAI's GPT model"""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful customer support assistant."},
                    {"role": "user", "content": message}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error getting AI response: {e}")
            return "I apologize, but I'm having trouble processing your request right now."
