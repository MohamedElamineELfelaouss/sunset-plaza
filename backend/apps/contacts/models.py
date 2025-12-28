from django.db import models
from apps.users.models import Visitor


class ContactRequest(models.Model):
    class RequestType(models.TextChoices):
        INFO = "INFO", "Information"
        CONTACT = "CONTACT", "Contact Request"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        TREATED = "TREATED", "Treated"

    visitor = models.ForeignKey(
        Visitor, on_delete=models.CASCADE, related_name="contact_requests"
    )
    request_type = models.CharField(
        max_length=50, choices=RequestType.choices, default=RequestType.INFO
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=50, choices=Status.choices, default=Status.PENDING
    )

    def __str__(self):
        return f"{self.subject} - {self.status}"
