from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import ChatbotInteraction, InterestCategory

# Import the constant we just made
from .services import GeminiService, FALLBACK_ERROR_MESSAGE
from apps.users.models import Visitor


class ChatbotView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response({"error": "Question is required"}, status=400)

        # 1. Get the "Sales Pitch" (or the Error Message)
        ai_response = GeminiService.generate_response(question)

        # 2. DECIDE THE CATEGORY
        # LOGIC CHANGE: If the AI failed, tag it as "Malfunction"
        if ai_response == FALLBACK_ERROR_MESSAGE:
            category, _ = InterestCategory.objects.get_or_create(label="Malfunction")
            confidence = 0.0  # Zero confidence because it failed
        else:
            # Otherwise, categorize normally based on the question
            category, confidence = GeminiService.categorize_interaction(question)

        # 3. Handle Visitor (Guest or User)
        visitor = None
        if request.user.is_authenticated and hasattr(request.user, "visitor_profile"):
            visitor = request.user.visitor_profile
        else:
            from apps.users.models import User

            guest_user, _ = User.objects.get_or_create(
                username="guest_user", defaults={"role": "VISITOR"}
            )
            visitor, _ = Visitor.objects.get_or_create(user=guest_user)

        # 4. Save to Database
        ChatbotInteraction.objects.create(
            visitor=visitor,
            category=category,
            question=question,
            response=ai_response,
            confidence_score=confidence,
        )
        return Response(
            {
                "response": ai_response,
                "category": category.label,
                "confidence": confidence,
            }
        )
