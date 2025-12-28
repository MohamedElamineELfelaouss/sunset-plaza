from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, VisitorRegistrationView, UserProfileView

urlpatterns = [
    # Auth
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", VisitorRegistrationView.as_view(), name="visitor_register"),
    # Profile
    path("me/", UserProfileView.as_view(), name="user_profile"),
]
