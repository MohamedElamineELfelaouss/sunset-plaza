from django.contrib import admin
from django.contrib import messages
from modeltranslation.admin import TabbedTranslationAdmin
from .models import SiteContent, ContentImage
from .translation_utils import auto_translate_content
from apps.users.models import Administrator


class ContentImageInline(admin.TabularInline):
    model = ContentImage
    extra = 3  # Show 3 empty slots for new images
    fields = ["image", "caption", "order"]
    ordering = ["order"]


@admin.register(SiteContent)
class SiteContentAdmin(TabbedTranslationAdmin):
    """
    Admin interface for SiteContent with tabbed translation support.
    Each translatable field (title, description, location) will have tabs
    for all configured languages (FR, EN, AR, ES, NL, DE, IT, PT).
    """
    
    # 1. Update columns to show Real Estate info
    list_display = (
        "title",
        "content_type",  # News vs Office
        "deal_type",  # Rent / Buy / Invest
        "price",  # Show Price
        "surface_area",  # Show Size (m²)
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
    
    # 5. Admin actions
    actions = ["auto_translate_selected"]
    
    # 6. Image gallery inline
    inlines = [ContentImageInline]

    def get_administrator_name(self, obj):
        """Display the username instead of the ID"""
        if obj.administrator:
            return obj.administrator.user.username
        return "-"

    get_administrator_name.short_description = "Posted By"

    @admin.action(description="🌐 Auto-translate from French (DeepL)")
    def auto_translate_selected(self, request, queryset):
        """
        Admin action to auto-translate selected items from French to all other languages.
        Uses DeepL API for translation.
        """
        translated_count = 0
        error_count = 0
        
        for obj in queryset:
            try:
                # Translate content
                auto_translate_content(obj)
                
                # Save using raw SQL update to avoid modeltranslation queryset issues
                # Get all translation fields and their values
                update_fields = {}
                for field in ['title', 'description', 'location']:
                    for lang in ['en', 'ar', 'es', 'nl', 'de', 'it', 'pt']:
                        field_name = f'{field}_{lang}'
                        value = getattr(obj, field_name, None)
                        if value:
                            update_fields[field_name] = value
                
                # Use direct update to bypass modeltranslation queryset issues
                if update_fields:
                    SiteContent.objects.filter(pk=obj.pk).update(**update_fields)
                
                translated_count += 1
            except Exception as e:
                error_count += 1
                messages.error(request, f"❌ Error translating '{obj.title}': {str(e)}")
        
        if translated_count:
            messages.success(
                request, 
                f"✅ Auto-translated {translated_count} item(s) to all 7 languages (EN, AR, ES, NL, DE, IT, PT)"
            )
        if error_count:
            messages.warning(
                request,
                f"⚠️ {error_count} item(s) could not be translated. Check DEEPL_API_KEY in .env"
            )

    def save_model(self, request, obj, form, change):
        """
        Auto-assign the Administrator based on the logged-in user.
        """
        if not obj.pk:  # Only run this when creating new content
            try:
                obj.administrator = request.user.admin_profile
            except Exception:
                messages.error(
                    request,
                    "⚠️ Error: Your user account is missing an 'Administrator' profile.",
                )

        super().save_model(request, obj, form, change)
