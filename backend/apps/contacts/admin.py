from django.contrib import admin
from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    # FIX: We replaced 'subject' with 'request_type' and 'request_date' with 'created_at'
    list_display = ("name", "request_type", "email", "status", "created_at")

    # FIX: Filter by the fields that actually exist
    list_filter = ("status", "request_type", "created_at")

    search_fields = ("name", "email", "message")

    # This allows you to change status from PENDING to CONTACTED directly in the list
    list_editable = ("status",)

    # 'created_at' is auto-generated, so we make it read-only
    readonly_fields = ("created_at",)
