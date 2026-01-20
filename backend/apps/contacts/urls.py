from django.urls import path
from .views import (
    SubmitContactRequestView,
    AdminContactListView,
    AdminContactDetailView,
    update_contact_status,
    contact_stats,
)

urlpatterns = [
    # Public endpoint
    path("submit/", SubmitContactRequestView.as_view(), name="submit_contact"),
    
    # Admin endpoints
    path("admin/", AdminContactListView.as_view(), name="admin_contact_list"),
    path("admin/stats/", contact_stats, name="admin_contact_stats"),
    path("admin/<int:pk>/", AdminContactDetailView.as_view(), name="admin_contact_detail"),
    path("admin/<int:pk>/status/", update_contact_status, name="admin_contact_status"),
]
