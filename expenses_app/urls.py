from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.expense_list, name='expense_list'),
    path('expenses/<int:pk>/', views.expense_detail, name='expense_detail'),
    path('register/', views.register, name='register'),
]