from django.db import models
from django.utils import timezone


class VisitorLog(models.Model):
    """Track visitor analytics silently in background"""
    
    # IP & Location
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True, default="")
    country_code = models.CharField(max_length=10, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    region = models.CharField(max_length=100, blank=True, default="")
    
    # Visit details
    page_visited = models.CharField(max_length=500, default="/")
    referrer = models.URLField(max_length=1000, blank=True, default="")
    
    # Device info
    user_agent = models.TextField(blank=True, default="")
    device_type = models.CharField(max_length=20, choices=[
        ("desktop", "Desktop"),
        ("mobile", "Mobile"),
        ("tablet", "Tablet"),
        ("unknown", "Unknown"),
    ], default="unknown")
    
    # Timestamps
    visited_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ["-visited_at"]
        verbose_name = "Visitor Log"
        verbose_name_plural = "Visitor Logs"
    
    def __str__(self):
        return f"{self.country or 'Unknown'} - {self.city or 'Unknown'} - {self.visited_at.strftime('%Y-%m-%d %H:%M')}"
