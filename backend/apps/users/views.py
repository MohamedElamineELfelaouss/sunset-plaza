from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    VisitorRegistrationSerializer,
)


# 1. Login View (Returns Token + Role)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# 2. Registration View (For Visitors)
class VisitorRegistrationView(generics.CreateAPIView):
    serializer_class = VisitorRegistrationSerializer
    permission_classes = [permissions.AllowAny]


# 3. Profile View (Get Current User Info)
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
