from django.contrib import admin
from .models import ChatbotInteraction, InterestCategory


@admin.register(InterestCategory)
class InterestCategoryAdmin(admin.ModelAdmin):
    list_display = ("label",)


@admin.register(ChatbotInteraction)
class ChatbotInteractionAdmin(admin.ModelAdmin):
    list_display = (
        "visitor",
        "short_question",
        "category",
        "confidence_score",
        "interaction_date",
    )
    list_filter = ("category", "interaction_date")

    # IMPROVEMENT 1: Add 'visitor__user__username'
    # Since our "Guest" users might not have emails, we need to search by username too.
    search_fields = (
        "question",
        "response",
        "visitor__user__email",
        "visitor__user__username",
    )

    readonly_fields = ("interaction_date",)

    # IMPROVEMENT 2: Performance Optimization
    # This tells Django to fetch the Visitor and Category in the SAME SQL query.
    # Without this, Django will fire a new query for every row in the list (N+1 problem).
    list_select_related = ("visitor", "category")

    def short_question(self, obj):
        return obj.question[:50] + "..." if len(obj.question) > 50 else obj.question

    short_question.short_description = "Question"
