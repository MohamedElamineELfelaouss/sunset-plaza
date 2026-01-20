from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    VisitorRegistrationSerializer,
    VisitorUpdateSerializer,
    AdminProfileSerializer,
    ChangePasswordSerializer,
)


# 1. Login View (Returns Token + Role)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# 2. Registration View (For Visitors)
class VisitorRegistrationView(generics.CreateAPIView):
    serializer_class = VisitorRegistrationSerializer
    permission_classes = [permissions.AllowAny]


# 3. Profile View (Get Current User Info - for visitors)
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


# 4. Admin Profile View (GET/PATCH profile for admin settings)
class AdminProfileView(APIView):
    """
    GET: Retrieve admin profile (name, email)
    PATCH: Update admin profile (first_name, last_name, email)
    """
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser
    
    def get(self, request):
        # Handle anonymous user
        if not request.user.is_authenticated:
            return Response({
                "id": 0,
                "username": "admin",
                "email": "admin@sunsetplaza.ma",
                "first_name": "Admin",
                "last_name": "",
                "name": "Admin"
            })
        serializer = AdminProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        # Handle anonymous user
        if not request.user.is_authenticated:
            return Response({"error": "Non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = AdminProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Profil mis à jour avec succès.",
                "data": serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 5. Change Password View (POST)
class ChangePasswordView(APIView):
    """
    POST: Change admin password (requires current_password, new_password, confirm_password)
    """
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser
    
    def post(self, request):
        # Handle anonymous user
        if not request.user.is_authenticated:
            return Response({"error": "Non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            # Change the password
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({
                "success": True,
                "message": "Mot de passe modifié avec succès."
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

