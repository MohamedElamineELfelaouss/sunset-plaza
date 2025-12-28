import os
from google import genai
from django.conf import settings
from .models import InterestCategory

# 1. Define the error message here so views.py can import it and check for it
FALLBACK_ERROR_MESSAGE = "Sunset Plaza is currently experiencing high demand. Please leave your contact details so our VIP team can secure your priority slot."


class GeminiService:
    @staticmethod
    def generate_response(user_question):
        """
        Sales-Focused AI Logic.
        Uses the new 'google-genai' SDK with Gemini 2.0 Flash for maximum speed.
        """
        # Initialize Client with the key from settings
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # --- THE SALES PERSONA (PRESERVED) ---
        system_instruction = """
        ROLE: You are the Senior Investment Consultant for 'Sunset Plaza', a premier real estate development offering high-end professional office spaces.
        GOAL: Your ONLY goal is to persuade the visitor to invest or book a meeting. You are a "Hard Seller" but smooth and professional.
        STRATEGY:
        1. ALWAYS highlight the High ROI (Return on Investment) and strategic location.
        2. Create a sense of URGENCY (e.g., "Units are selling fast", "Limited availability").
        3. If they ask about price, justify it with value (luxury amenities, business growth potential).
        4. Never just say "I don't know." Pivot to: "That's a great detail, let's discuss it in a private meeting to fit your specific needs."
        5. Keep responses short, punchy, and seductive.
        CONTEXT: Sunset Plaza is the future of business luxury. Don't just answer questions; SELL THE DREAM.
        """

        try:
            # Using 'gemini-2.0-flash' for speed
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"{system_instruction}\n\nVisitor Question: {user_question}\n\nYour Persuasive Answer:",
            )
            return response.text
        except Exception as e:
            # Log the error for the admin
            print(f"🔴 AI ERROR: {e}")
            # 2. Return the constant defined above
            return FALLBACK_ERROR_MESSAGE

    @staticmethod
    def categorize_interaction(text):
        """
        Returns: (InterestCategory, float)
            - High score (0.95) for specific sales keywords.
            - Low score (0.5) for general inquiries.
        Categorizes the intent to help the Admin see what leads are interested in.
        Simple keyword matching (Fast & No Overengineering).
        """
        text = text.lower()

        # We use get_or_create to ensure the categories exist in the DB
        if any(w in text for w in ["price", "cost", "budget", "expensive", "how much", "quote"]):
            cat = InterestCategory.objects.get_or_create(label="Pricing")[0]
            return cat, 0.95
        
        elif any(w in text for w in ["invest", "roi", "profit", "yield", "money", "buy"]):
            cat = InterestCategory.objects.get_or_create(label="Investment")[0]
            return cat, 0.95
        
        elif any(w in text for w in ["where", "location", "address", "map", "city", "place"]):
            cat = InterestCategory.objects.get_or_create(label="Location")[0]
            return cat, 0.95
        
        # LOW CONFIDENCE (Vague intent)
        else:
            cat = InterestCategory.objects.get_or_create(label="General Inquiry")[0]
            return cat, 0.50
