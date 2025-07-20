from django.db import models
from django.utils.translation import gettext_lazy as _

class Todo(models.Model):
    
    class Priority(models.TextChoices):
        HIGH = "HI", _('HIGH')
        LOW = "LO", _("LOW")
        MEDIUM = "ME", _("MEDIUM")
    
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    priority = models.CharField(
        max_length = 2,
        choices = Priority.choices,
        default = Priority.LOW,
    )
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title