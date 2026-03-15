from django.urls import path
from .views import (
    TriageView,
    StatsView,
    RegisterView,
    LoginView,
    LogoutView,
    HistoryView,
    ChromaDBStatsView,
    UserContextView
)

urlpatterns = [
    # Authentication
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    
    # Triage
    path("triage/", TriageView.as_view(), name="triage"),
    
    # Stats & History
    path('stats/', StatsView.as_view(), name='stats'),
    path('history/', HistoryView.as_view(), name='history'),
    
    # ChromaDB
    path('chromadb/stats/', ChromaDBStatsView.as_view(), name='chromadb_stats'),
    path('chromadb/context/', UserContextView.as_view(), name='user_context'),
]