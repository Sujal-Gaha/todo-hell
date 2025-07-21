from django.db import models
from django.utils.translation import gettext_lazy as _

class Todo(models.Model):
    
    class Priority(models.TextChoices):
        HIGH = "HI", _('HIGH')
        LOW = "LO", _("LOW")
        MEDIUM = "ME", _("MEDIUM")
        URGENT = "UR", _("URGENT")
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=200, blank=True, default="")
    priority = models.CharField(
        max_length = 2,
        choices = Priority.choices,
        default = Priority.LOW,
    )
    completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.priority}"