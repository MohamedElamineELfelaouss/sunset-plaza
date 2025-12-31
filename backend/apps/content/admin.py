from django.contrib import admin
from django.contrib import messages
from .models import SiteContent
from apps.users.models import Administrator


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    # 1. Update columns to show Real Estate info
    list_display = (
        "title",
        "content_type",  # News vs Office
        "deal_type",  # Rent / Buy / Invest
        "price",  # Show Price
        "surface_area",  # Show Size (mÂ²)
        "location",  # Show Location
        "status",
        "updated_at",
        "get_administrator_name",
    )

    # 2. Add filters for the new types
    list_filter = ("status", "content_type", "deal_type", "updated_at")

    # 3. Add location to search
    search_fields = ("title", "description", "location")

    # 4. Hide auto-generated fields from editing
    readonly_fields = ("updated_at", "created_at")
    exclude = ("administrator",)

    def get_administrator_name(self, obj):
        """Display the username instead of the ID"""
        if obj.administrator:
            return obj.administrator.user.username
        return "-"

    get_administrator_name.short_description = "Posted By"

    def save_model(self, request, obj, form, change):
        """
        Auto-assign the Administrator based on the logged-in user.
        """
        if not obj.pk:  # Only run this when creating new content
            try:
                # We can now access this directly because we fixed the Signals!
                obj.administrator = request.user.admin_profile
            except Exception:
                # Safety valve in case the profile is missing
                messages.error(
                    request,
                    "âš ï¸ Error: Your user account is missing an 'Administrator' profile.",
                )

        super().save_model(request, obj, form, change)

