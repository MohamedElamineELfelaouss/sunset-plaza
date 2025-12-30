from rest_framework import generics, permissions
from .models import SiteContent
from .serializers import SiteContentSerializer


class PublicContentListView(generics.ListAPIView):
    """
    Endpoint: GET /api/content/
    Usage: Fetches all 'PUBLISHED' content blocks for the frontend.
    """

    serializer_class = SiteContentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return SiteContent.objects.filter(status=SiteContent.Status.PUBLISHED).order_by(
            "-updated_at"
        )  # Best Practice: Always order lists (newest first)
