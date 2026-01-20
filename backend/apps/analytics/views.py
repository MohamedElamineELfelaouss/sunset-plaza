import requests
from datetime import timedelta
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .models import VisitorLog


def get_client_ip(request):
    """Extract client IP from request headers"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_public_ip():
    """Get the server's public IP for testing in development"""
    try:
        response = requests.get('https://api.ipify.org?format=json', timeout=3)
        if response.status_code == 200:
            return response.json().get('ip')
    except Exception:
        pass
    return None


def get_device_type(user_agent: str) -> str:
    """Detect device type from user agent"""
    user_agent = user_agent.lower()
    if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
        return 'mobile'
    elif 'tablet' in user_agent or 'ipad' in user_agent:
        return 'tablet'
    elif user_agent:
        return 'desktop'
    return 'unknown'


def get_geolocation(ip: str) -> dict:
    """Get geolocation data from IP using free ip-api.com"""
    try:
        if not ip:
            return {}
        
        response = requests.get(
            f"http://ip-api.com/json/{ip}?fields=status,country,countryCode,city,regionName",
            timeout=3
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                return {
                    'country': data.get('country', ''),
                    'country_code': data.get('countryCode', ''),
                    'city': data.get('city', ''),
                    'region': data.get('regionName', ''),
                }
    except Exception:
        pass
    return {}


@api_view(['POST'])
@permission_classes([AllowAny])
def track_visitor(request):
    """Track a visitor silently - called from frontend on page load."""
    try:
        ip = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        if ip in ['127.0.0.1', 'localhost', '::1'] or ip.startswith('192.168.') or ip.startswith('10.'):
            public_ip = get_public_ip()
            if public_ip:
                ip = public_ip
        
        geo_data = get_geolocation(ip)
        page_visited = request.data.get('page', '/')
        referrer = request.data.get('referrer', '')
        
        VisitorLog.objects.create(
            ip_address=ip,
            country=geo_data.get('country', ''),
            country_code=geo_data.get('country_code', ''),
            city=geo_data.get('city', ''),
            region=geo_data.get('region', ''),
            page_visited=page_visited,
            referrer=referrer,
            user_agent=user_agent,
            device_type=get_device_type(user_agent),
        )
        
        return Response({'status': 'ok'}, status=status.HTTP_201_CREATED)
    except Exception:
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)


# ==================== ADMIN DASHBOARD APIs ====================

@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser in production
def dashboard_summary(request):
    """Get summary stats for admin dashboard KPI cards"""
    now = timezone.now()
    today = now.date()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    # Total stats
    total_visitors = VisitorLog.objects.count()
    unique_ips = VisitorLog.objects.values('ip_address').distinct().count()
    total_countries = VisitorLog.objects.exclude(country='').values('country').distinct().count()
    
    # Today stats
    visitors_today = VisitorLog.objects.filter(visited_at__date=today).count()
    
    # This week stats
    visitors_week = VisitorLog.objects.filter(visited_at__gte=week_ago).count()
    
    # This month stats
    visitors_month = VisitorLog.objects.filter(visited_at__gte=month_ago).count()
    
    # Device breakdown
    devices = VisitorLog.objects.values('device_type').annotate(count=Count('id'))
    device_stats = {d['device_type']: d['count'] for d in devices}
    total = sum(device_stats.values()) or 1
    desktop_pct = round((device_stats.get('desktop', 0) / total) * 100)
    
    return Response({
        'total_visitors': total_visitors,
        'unique_visitors': unique_ips,
        'total_countries': total_countries,
        'visitors_today': visitors_today,
        'visitors_week': visitors_week,
        'visitors_month': visitors_month,
        'desktop_percentage': desktop_pct,
    })


@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser in production
def traffic_stats(request):
    """Get daily traffic data for line chart (last 30 days)"""
    days = int(request.query_params.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    traffic = (
        VisitorLog.objects
        .filter(visited_at__gte=start_date)
        .annotate(date=TruncDate('visited_at'))
        .values('date')
        .annotate(visitors=Count('id'))
        .order_by('date')
    )
    
    return Response([
        {'date': t['date'].isoformat(), 'visitors': t['visitors']}
        for t in traffic
    ])


@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser in production
def device_stats(request):
    """Get device type breakdown for pie chart"""
    devices = (
        VisitorLog.objects
        .values('device_type')
        .annotate(count=Count('id'))
        .order_by('-count')
    )
    
    colors = {
        'desktop': '#C4A052',
        'mobile': '#22C55E',
        'tablet': '#3B82F6',
        'unknown': '#64748B',
    }
    
    return Response([
        {
            'name': d['device_type'].capitalize(),
            'value': d['count'],
            'color': colors.get(d['device_type'], '#64748B')
        }
        for d in devices
    ])


@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser in production
def country_stats(request):
    """Get top countries breakdown for geo chart/table"""
    limit = int(request.query_params.get('limit', 10))
    
    countries = (
        VisitorLog.objects
        .exclude(country='')
        .values('country', 'country_code')
        .annotate(visitors=Count('id'))
        .order_by('-visitors')[:limit]
    )
    
    return Response(list(countries))


@api_view(['GET'])
@permission_classes([AllowAny])  # TODO: Change to IsAdminUser in production
def recent_visitors(request):
    """Get recent visitors for live feed table"""
    limit = int(request.query_params.get('limit', 20))
    
    visitors = VisitorLog.objects.all()[:limit]
    
    return Response([
        {
            'id': v.id,
            'country': v.country or 'Unknown',
            'country_code': v.country_code,
            'city': v.city or 'Unknown',
            'device': v.device_type,
            'page': v.page_visited,
            'time': v.visited_at.isoformat(),
        }
        for v in visitors
    ])
