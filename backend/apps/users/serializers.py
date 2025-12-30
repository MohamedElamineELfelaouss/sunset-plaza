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
        fields = ["username", "email", "password", "first_name", "last_name","role"]
        read_only_fields = ["role"]

    def create(self, validated_data):
        # 1. Create the base User
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=User.Role.VISITOR,
        )
        # 2. Automatically create the Visitor profile
        # Visitor.objects.create(user=user)  # <-- No longer needed due to signals
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # This adds claims INSIDE the encrypted token (for backend security)
        token["role"] = user.role
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # This adds data to the VISIBLE JSON response (for frontend ease)
        data["role"] = self.user.role
        data["username"] = self.user.username
        data["id"] = self.user.id
        return data


class VisitorUpdateSerializer(serializers.ModelSerializer):
    # We explicitly define these to map them to the related User model
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Visitor
        fields = ["first_name", "last_name", "email", "phone_number", "address"]

    def update(self, instance, validated_data):
        # 1. Update the User info (Name, Email)
        user_data = validated_data.pop("user", {})
        user = instance.user

        user.first_name = user_data.get("first_name", user.first_name)
        user.last_name = user_data.get("last_name", user.last_name)
        user.email = user_data.get("email", user.email)
        user.save()

        # 2. Update the Visitor info (Phone, Address)
        instance.phone_number = validated_data.get(
            "phone_number", instance.phone_number
        )
        instance.address = validated_data.get("address", instance.address)
        instance.save()

        return instance
