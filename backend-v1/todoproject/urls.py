from django.contrib import admin
from django.urls import path, include

BASE_API_PATH = 'api/v1/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(BASE_API_PATH, include('todos.urls')),
]