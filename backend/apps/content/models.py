from django.db import models
from apps.users.models import Administrator


class SiteContent(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=50, choices=Status.choices, default=Status.DRAFT
    )
    updated_at = models.DateTimeField(auto_now=True)
    administrator = models.ForeignKey(
        Administrator,
        on_delete=models.SET_NULL,
        null=True,
        related_name="managed_content",
    )

    def __str__(self):
        return self.title
