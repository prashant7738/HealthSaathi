from django.db import models
from django.contrib.auth.models import User


class TriageSession(models.Model):
    RISK_CHOICES = [
        ('HIGH',   'High'),
        ('MEDIUM', 'Medium'),
        ('LOW',    'Low'),
    ]
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES)
    district   = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='triage_sessions')
    user_email = models.EmailField(blank=True, default='')
    session_id = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"{self.risk_level} - {self.created_at}"