from django.urls import path
from .views import (
    TriageView,
    StatsView,
    RegisterView,
    LoginView,
    LogoutView,
    HistoryView
)
from .baato import BaatoView

urlpatterns = [
    path("triage/", TriageView.as_view(), name="triage"),
    path('stats/', StatsView.as_view(), name='stats'),
]