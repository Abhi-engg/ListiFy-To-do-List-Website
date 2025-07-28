from django.urls import path
from . import views

urlpatterns=[
    path('listify/', views.listify,name='listify'),
]