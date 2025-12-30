from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save  # <--- Needed for the signal
from django.dispatch import receiver  # <--- Fixes "receiver is not defined"


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
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}"


class Administrator(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="admin_profile"
    )

    def __str__(self):
        return f"{self.user.username}"


# --- SIGNALS ---


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create a profile when a User is created.
    """
    if created:
        # If the user is a Superuser, force the role to ADMIN and create Admin profile
        if instance.is_superuser:
            if instance.role != User.Role.ADMIN:
                instance.role = User.Role.ADMIN
                instance.save()
            Administrator.objects.get_or_create(user=instance)

        # Otherwise, handle based on the assigned role
        elif instance.role == User.Role.ADMIN:
            Administrator.objects.get_or_create(user=instance)
        else:
            # Default to Visitor profile for everyone else
            Visitor.objects.get_or_create(user=instance)
