from rest_framework import serializers
from .models import SiteContent, ContentImage


class ContentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentImage
        fields = ["id", "image", "caption", "order"]


class SiteContentSerializer(serializers.ModelSerializer):
    """Public serializer - excludes drafts, read-only"""
    images = ContentImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = SiteContent
        fields = [
            "id", "title", "description", "updated_at", "image", "images",
            "content_type", "deal_type", "price", "surface_area", "location",
        ]


class AdminSiteContentSerializer(serializers.ModelSerializer):
    """Admin serializer - full access including status, translations, and created_at"""
    images = ContentImageSerializer(many=True, read_only=True)
    is_translated = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteContent
        fields = [
            "id", 
            # Default fields (FR - default language)
            "title", "description", "location",
            # French translations
            "title_fr", "description_fr", "location_fr",
            # English translations
            "title_en", "description_en", "location_en",
            # Arabic translations
            "title_ar", "description_ar", "location_ar",
            # Other fields
            "image", "images",
            "status", "content_type", "deal_type",
            "price", "surface_area",
            "created_at", "updated_at",
            "is_translated",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "is_translated"]
    
    def get_is_translated(self, obj):
        """Check if the content has been translated (has English title)"""
        return bool(obj.title_en)
    
    def update(self, instance, validated_data):
        """
        Custom update to avoid django-modeltranslation MultilingualQuerySet issue.
        Uses direct field assignment + update() instead of save().
        """
        # Get all fields that were provided
        update_fields = []
        for field_name, value in validated_data.items():
            setattr(instance, field_name, value)
            update_fields.append(field_name)
        
        if update_fields:
            # Use update() on the queryset which bypasses the save() issue
            SiteContent.objects.filter(pk=instance.pk).update(**validated_data)
            # Refresh instance from db
            instance.refresh_from_db()
        
        return instance

