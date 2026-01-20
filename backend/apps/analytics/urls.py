from django.urls import path
from . import views

urlpatterns = [
    # Visitor tracking (frontend calls this)
    path('track/', views.track_visitor, name='track_visitor'),
    
    # Admin Dashboard APIs
    path('dashboard/summary/', views.dashboard_summary, name='dashboard_summary'),
    path('dashboard/traffic/', views.traffic_stats, name='traffic_stats'),
    path('dashboard/devices/', views.device_stats, name='device_stats'),
    path('dashboard/countries/', views.country_stats, name='country_stats'),
    path('dashboard/visitors/', views.recent_visitors, name='recent_visitors'),
]
