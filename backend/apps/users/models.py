from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrator"
        VISITOR = "VISITOR", "Visitor"

    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.VISITOR,
    )


class Visitor(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="visitor_profile"
    )

    def __str__(self):
        return f"Visitor: {self.user.username}"


class Administrator(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="admin_profile"
    )

    def __str__(self):
        return f"Administrator: {self.user.username}"
