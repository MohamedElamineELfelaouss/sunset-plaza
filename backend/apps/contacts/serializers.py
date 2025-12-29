from rest_framework import serializers
from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ["id", "name", "email", "phone", "request_type", "message", "status"]
        read_only_fields = [
            "id",
            "status",
        ]  # User cannot set their own status to "TREATED"
