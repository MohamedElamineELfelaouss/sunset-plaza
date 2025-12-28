from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Visitor, Administrator


class UserSerializer(serializers.ModelSerializer):
    """
    Standard profile serializer.
    """

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom Logic: Inject the 'role' into the Login Token.
    This lets the Frontend know immediately if the user is an Admin or Visitor.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.username
        return token


class VisitorRegistrationSerializer(serializers.ModelSerializer):
    """
    Logic: Handle new Visitor sign-ups.
    """

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        # 1. Create the base User
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=User.Role.VISITOR,
        )
        # 2. Automatically create the Visitor profile
        Visitor.objects.create(user=user)
        return user
