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
    # Authentication
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    
    # Triage
    path("triage/", TriageView.as_view(), name="triage"),
    
    # Health Facilities (Baato API)
    path("baato/", BaatoView.as_view(), name="baato"),
    
    # Stats & History
    path('stats/', StatsView.as_view(), name='stats'),
    path('history/', HistoryView.as_view(), name='history'),
]