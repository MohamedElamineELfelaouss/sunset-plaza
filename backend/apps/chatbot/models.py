from django.db import models
from apps.users.models import Visitor


class InterestCategory(models.Model):
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.label


class ChatbotInteraction(models.Model):
    visitor = models.ForeignKey(
        Visitor, on_delete=models.CASCADE, related_name="interactions"
    )
    category = models.ForeignKey(
        InterestCategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    question = models.TextField()
    response = models.TextField()
    interaction_date = models.DateTimeField(auto_now_add=True)
    confidence_score = models.FloatField(default=0.0)

    def __str__(self):
        return f"Interaction: {self.visitor.user.username}"
