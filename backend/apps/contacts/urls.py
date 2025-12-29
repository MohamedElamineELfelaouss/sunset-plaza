from django.urls import path
from .views import SubmitContactRequestView

urlpatterns = [
    path("submit/", SubmitContactRequestView.as_view(), name="submit_contact"),
]
