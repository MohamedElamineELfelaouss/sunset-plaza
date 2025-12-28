from django.contrib import admin
from .models import SiteContent


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "updated_at", "administrator")
    list_filter = ("status", "updated_at")
    search_fields = ("title", "description")
    readonly_fields = ("updated_at",)
