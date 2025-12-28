from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Visitor, Administrator


class CustomUserAdmin(UserAdmin):
    # Add 'role' to the list of columns
    list_display = ["username", "email", "role", "is_staff", "date_joined"]
    list_filter = ["role", "is_staff", "is_active"]

    # Add 'role' to the edit form
    fieldsets = UserAdmin.fieldsets + (("Role Definition", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {"fields": ("role",)}),)


admin.site.register(User, CustomUserAdmin)
admin.site.register(Visitor)
admin.site.register(Administrator)
