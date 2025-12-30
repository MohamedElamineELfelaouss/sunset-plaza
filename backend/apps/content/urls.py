from django.urls import path
from .views import PublicContentListView, PublicContentDetailView

urlpatterns = [
    path("", PublicContentListView.as_view(), name="content_list"),
    path(
        "<int:pk>/", PublicContentDetailView.as_view(), name="content_detail"
    ),
]
