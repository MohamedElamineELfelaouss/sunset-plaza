from django.contrib import admin
from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("subject", "visitor", "request_type", "status", "request_date")
    list_filter = ("status", "request_type", "request_date")
    search_fields = ("subject", "message", "visitor__user__email")
    readonly_fields = ("request_date",)
    list_editable = ("status",)  # Allows you to change status directly from the list!
