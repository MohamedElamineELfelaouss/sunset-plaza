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


class PublicContentDetailView(generics.RetrieveAPIView):
    """
    Endpoint: GET /api/content/<pk>/
    Usage: Fetches a single office/article details
    """

    queryset = SiteContent.objects.filter(status=SiteContent.Status.PUBLISHED)
    serializer_class = SiteContentSerializer
    permission_classes = [permissions.AllowAny]
