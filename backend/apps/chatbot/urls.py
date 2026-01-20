from django.urls import path
from .views import ChatbotView, admin_chatbot_list, admin_chatbot_stats, admin_chatbot_delete

urlpatterns = [
    # Public endpoint
    path("ask/", ChatbotView.as_view(), name="chatbot_ask"),
    
    # Admin endpoints
    path("admin/", admin_chatbot_list, name="admin_chatbot_list"),
    path("admin/stats/", admin_chatbot_stats, name="admin_chatbot_stats"),
    path("admin/<int:pk>/", admin_chatbot_delete, name="admin_chatbot_delete"),
]
