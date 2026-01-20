from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.db.models import Count, Avg
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

        # 2b. CONTROL BOOKING FORM TRIGGER
        booking_tag = "<SHOW_BOOKING_FORM>"
        cleaned_response = ai_response.replace(booking_tag, "").strip()
        should_trigger_booking = (
            confidence >= 0.9 and category.label in {"Pricing", "Investment"}
        )
        if should_trigger_booking:
            ai_response = f"{cleaned_response} {booking_tag}".strip()
        else:
            ai_response = cleaned_response

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


# ==================== ADMIN ENDPOINTS ====================

@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser
def admin_chatbot_list(request):
    """
    GET /api/chatbot/admin/
    List all chatbot interactions
    """
    interactions = ChatbotInteraction.objects.all().order_by('-interaction_date')[:100]
    
    data = [{
        'id': i.id,
        'question': i.question[:100] + '...' if len(i.question) > 100 else i.question,
        'response': i.response[:150] + '...' if len(i.response) > 150 else i.response,
        'category': i.category.label if i.category else 'Unknown',
        'confidence': round(i.confidence_score, 2),
        'date': i.interaction_date.isoformat(),
    } for i in interactions]
    
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser
def admin_chatbot_stats(request):
    """
    GET /api/chatbot/admin/stats/
    Get chatbot statistics
    """
    total = ChatbotInteraction.objects.count()
    avg_confidence = ChatbotInteraction.objects.aggregate(avg=Avg('confidence_score'))['avg'] or 0
    
    # By category
    categories = ChatbotInteraction.objects.values('category__label').annotate(
        count=Count('id')
    ).order_by('-count')
    
    return Response({
        'total_interactions': total,
        'avg_confidence': round(avg_confidence, 2),
        'by_category': [
            {'category': c['category__label'] or 'Unknown', 'count': c['count']}
            for c in categories
        ]
    })


@api_view(['DELETE'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser
def admin_chatbot_delete(request, pk):
    """
    DELETE /api/chatbot/admin/<pk>/
    Delete a chatbot interaction
    """
    try:
        interaction = ChatbotInteraction.objects.get(pk=pk)
        interaction.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)
    except ChatbotInteraction.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
