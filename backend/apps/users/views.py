from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    VisitorRegistrationSerializer,
    VisitorUpdateSerializer,
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


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # GET: View Profile
    def get(self, request):
        # We use the update serializer here too so the user sees their phone/address
        # We access the profile using 'request.user.visitor_profile'
        try:
            visitor_profile = request.user.visitor_profile
            serializer = VisitorUpdateSerializer(visitor_profile)
            return Response(serializer.data)
        except:
            # Fallback for Admins who might not have a visitor profile
            return Response(UserSerializer(request.user).data)

    # PATCH: Update Profile
    def patch(self, request):
        try:
            visitor_profile = request.user.visitor_profile
            serializer = VisitorUpdateSerializer(
                visitor_profile, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except:
            return Response(
                {"error": "Profile not found or you are not a visitor."}, status=404
            )
