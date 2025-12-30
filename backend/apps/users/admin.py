# backend/apps/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Visitor, Administrator


# 1. Keep the Inline definition exactly as it was
class VisitorInline(admin.StackedInline):
    model = Visitor
    can_delete = False
    verbose_name_plural = "Visitor Profile"
    fk_name = "user"


# 2. Update the UserAdmin to be dynamic
class CustomUserAdmin(UserAdmin):
    list_display = ["username", "email", "role", "is_staff", "date_joined"]
    list_filter = ["role", "is_staff", "is_active"]

    fieldsets = UserAdmin.fieldsets + (("Role Definition", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {"fields": ("role",)}),)

    # --- THE FIX IS HERE ---
    # We removed "inlines = [VisitorInline]"

    def get_inline_instances(self, request, obj=None):
        """
        Dynamic logic: Only show the Visitor Profile section
        if the user is actually a VISITOR.
        """
        if not obj:
            return list()

        # If the user's role is VISITOR, show the profile box
        if obj.role == User.Role.VISITOR:
            return [VisitorInline(self.model, self.admin_site)]

        # If they are ADMIN (or anything else), show nothing extra
        return []


admin.site.register(User, CustomUserAdmin)
# You can keep these registered if you want to debug them separately
admin.site.register(Visitor)
admin.site.register(Administrator)
