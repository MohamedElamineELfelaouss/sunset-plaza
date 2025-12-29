from rest_framework import generics, permissions
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from apps.users.models import Visitor


class SubmitContactRequestView(generics.CreateAPIView):
    """
    Endpoint: POST /api/contacts/submit/
    Public access.
    """

    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Ignore tokens completely for this view

    def perform_create(self, serializer):
        # Optional: Link to visitor if logged in
        visitor = None
        if self.request.user.is_authenticated:
            try:
                visitor = self.request.user.visitor_profile
            except:
                pass

        serializer.save(visitor=visitor)
