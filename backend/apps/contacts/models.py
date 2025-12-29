from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import Visitor


class ContactRequest(models.Model):
    class RequestType(models.TextChoices):
        INVESTMENT = "INVESTMENT", _("Investment Inquiry")
        INFO = "INFO", _("General Information")
        MEETING = "MEETING", _("Book a Meeting")

    class Status(models.TextChoices):
        PENDING = "PENDING", _("Pending")
        CONTACTED = "CONTACTED", _("Contacted")
        CLOSED = "CLOSED", _("Closed")

    # --- FIX: Add these fields for Anonymous Users ---
    name = models.CharField(max_length=100)  # The missing field causing the 500 error
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    # -------------------------------------------------

    # Optional link to a registered Visitor
    visitor = models.ForeignKey(
        Visitor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_requests",
    )

    request_type = models.CharField(
        max_length=20, choices=RequestType.choices, default=RequestType.INFO
    )

    message = models.TextField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.request_type}"
