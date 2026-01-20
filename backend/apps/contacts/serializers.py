from rest_framework import serializers
from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    """Public serializer - used when users submit contact forms"""
    class Meta:
        model = ContactRequest
        fields = ["id", "name", "email", "phone", "request_type", "message", "status"]
        read_only_fields = ["id", "status"]


class AdminContactSerializer(serializers.ModelSerializer):
    """Admin serializer - full access to all fields"""
    class Meta:
        model = ContactRequest
        fields = ["id", "name", "email", "phone", "request_type", "message", "status", "created_at"]
        read_only_fields = ["id", "created_at"]
