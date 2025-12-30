from django.db import models
from apps.users.models import Administrator


class SiteContent(models.Model):
    # 1. Status (Draft/Published)
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"

    # 2. Content Type (Distinguish between a generic Article and an Office Listing)
    class ContentType(models.TextChoices):
        NEWS = "NEWS", "News / Article"
        OFFICE = "OFFICE", "Office Space"

    # --- Core Fields ---
    title = models.CharField(max_length=255)
    description = models.TextField()

    # NEW: Image is crucial for Real Estate
    # Requires: pip install pillow
    image = models.ImageField(upload_to="content_images/", blank=True, null=True)

    # --- Categorization ---
    status = models.CharField(
        max_length=50, choices=Status.choices, default=Status.DRAFT, db_index=True
    )
    content_type = models.CharField(
        max_length=50,
        choices=ContentType.choices,
        default=ContentType.NEWS,
        db_index=True,
    )

    # --- Real Estate Specific Fields (Optional, only for Offices) ---
    price = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True, help_text="Price in MAD"
    )
    surface_area = models.FloatField(null=True, blank=True, help_text="Size in m²")
    location = models.CharField(
        max_length=100, blank=True, null=True, help_text="e.g. 3rd Floor, Building A"
    )

    # --- Meta Data ---
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # Good to track when it was created

    administrator = models.ForeignKey(
        Administrator,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_content",
    )

    def __str__(self):
        return f"[{self.get_content_type_display()}] {self.title}"
