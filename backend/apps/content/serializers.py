from rest_framework import serializers
from .models import SiteContent


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = [
            "id",
            "title",
            "description",
            "updated_at",
            "image",
            "content_type",
            "deal_type",
            "price",
            "surface_area",
            "location",
        ]
