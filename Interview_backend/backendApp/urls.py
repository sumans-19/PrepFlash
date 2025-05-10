from django.urls import path
from .views import  generate_resume

urlpatterns = [
    path('generate-resume/', generate_resume),
    
]

