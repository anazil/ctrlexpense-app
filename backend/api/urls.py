from django.urls import path
from . import views, auth_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/signup/', auth_views.signup, name='signup'),
    path('auth/signin/', auth_views.signin, name='signin'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
    path('transactions/', views.transactions, name='transactions'),
    path('categories/', views.categories, name='categories'),
    path('analytics/', views.analytics, name='analytics'),
]