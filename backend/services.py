from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL

class ChatService:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = GROQ_MODEL
        self.system_prompt = (
            "You are a helpful, encouraging, and knowledgeable educational AI tutor developed by Evaextra.com. "
            "Explain concepts clearly, use analogies when appropriate, ask guiding questions "
            "to help students learn, and keep answers concise and engaging. You are dealing with young people aged 20 or under."
        )

    def get_response(self, user_message: str, chat_history: list = None) -> str:
        messages = [{"role": "system", "content": self.system_prompt}]
        
        if chat_history:
            for msg in chat_history:
                messages.append({"role": msg.get("role"), "content": msg.get("content")})
                
        messages.append({"role": "user", "content": user_message})

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=1.9,
                max_tokens=1000,
            )
            return completion.choices[0].message.content
        except Exception as e:
            raise RuntimeError(f"Error communicating with Groq API: {str(e)}")
