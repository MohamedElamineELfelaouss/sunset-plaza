from django.urls import path
from .views import PublicContentListView

urlpatterns = [
    path("", PublicContentListView.as_view(), name="content_list"),
]
