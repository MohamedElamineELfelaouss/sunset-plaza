from django.urls import path
from .views import (
    PublicContentListView,
    PublicContentDetailView,
    AdminContentListCreateView,
    AdminContentDetailView,
    toggle_publish_status,
    content_stats,
    ContentImageUploadView,
    delete_content_image,
    reorder_content_images,
    set_main_image,
    auto_translate_content_view,
)

urlpatterns = [
    # Public endpoints
    path("", PublicContentListView.as_view(), name="content_list"),
    path("<int:pk>/", PublicContentDetailView.as_view(), name="content_detail"),
    
    # Admin endpoints
    path("admin/", AdminContentListCreateView.as_view(), name="admin_content_list"),
    path("admin/stats/", content_stats, name="admin_content_stats"),
    path("admin/<int:pk>/", AdminContentDetailView.as_view(), name="admin_content_detail"),
    path("admin/<int:pk>/publish/", toggle_publish_status, name="admin_content_publish"),
    path("admin/<int:pk>/translate/", auto_translate_content_view, name="admin_content_translate"),
    
    # Image management
    path("admin/<int:pk>/images/", ContentImageUploadView.as_view(), name="admin_content_images"),
    path("admin/<int:pk>/images/<int:image_id>/", delete_content_image, name="admin_content_image_delete"),
    path("admin/<int:pk>/images/reorder/", reorder_content_images, name="admin_content_images_reorder"),
    path("admin/<int:pk>/images/<int:image_id>/main/", set_main_image, name="admin_content_image_main"),
]
