from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import ContactRequest
from .serializers import ContactRequestSerializer, AdminContactSerializer
from apps.users.models import Visitor


class SubmitContactRequestView(generics.CreateAPIView):
    """
    Endpoint: POST /api/contacts/submit/
    Public access - users submit contact forms
    """
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def perform_create(self, serializer):
        visitor = None
        if self.request.user.is_authenticated:
            try:
                visitor = self.request.user.visitor_profile
            except:
                pass
        serializer.save(visitor=visitor)


# ==================== ADMIN ENDPOINTS ====================

class AdminContactListView(generics.ListAPIView):
    """
    GET /api/contacts/admin/
    List all contact requests for admin dashboard
    """
    queryset = ContactRequest.objects.all().order_by('-created_at')
    serializer_class = AdminContactSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser


class AdminContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/DELETE /api/contacts/admin/<id>/
    View, update, or delete a specific contact request
    """
    queryset = ContactRequest.objects.all()
    serializer_class = AdminContactSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser


@api_view(['PATCH'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def update_contact_status(request, pk):
    """
    PATCH /api/contacts/admin/<id>/status/
    Quick status update: { "status": "CONTACTED" }
    """
    try:
        contact = ContactRequest.objects.get(pk=pk)
    except ContactRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if new_status not in ['PENDING', 'CONTACTED', 'CLOSED']:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
    
    contact.status = new_status
    contact.save()
    return Response(AdminContactSerializer(contact).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def contact_stats(request):
    """
    GET /api/contacts/admin/stats/
    Get contact statistics for dashboard
    """
    total = ContactRequest.objects.count()
    pending = ContactRequest.objects.filter(status='PENDING').count()
    contacted = ContactRequest.objects.filter(status='CONTACTED').count()
    closed = ContactRequest.objects.filter(status='CLOSED').count()
    
    return Response({
        'total': total,
        'pending': pending,
        'contacted': contacted,
        'closed': closed,
    })
