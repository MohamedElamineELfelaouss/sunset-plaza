from django.contrib import admin
from .models import VisitorLog


@admin.register(VisitorLog)
class VisitorLogAdmin(admin.ModelAdmin):
    list_display = ["country", "city", "device_type", "page_visited", "visited_at"]
    list_filter = ["country", "device_type", "visited_at"]
    search_fields = ["country", "city", "ip_address"]
    readonly_fields = ["ip_address", "country", "country_code", "city", "region", 
                       "page_visited", "referrer", "user_agent", "device_type", "visited_at"]
    ordering = ["-visited_at"]
    
    def has_add_permission(self, request):
        return False  # Visitors are added automatically
    
    def has_change_permission(self, request, obj=None):
        return False  # Read-only
