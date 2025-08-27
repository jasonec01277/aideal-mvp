from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django.conf import settings
from django.urls import get_resolver


@api_view(['GET'])
@renderer_classes([JSONRenderer])  # force JSON output
def debug_view(request):
    """
    Lightweight debug endpoint to inspect backend settings.
    Always returns JSON (never tries HTML templates).
    """
    urlconf = get_resolver()

    return Response({
        "DRF": True,
        "DEFAULT_AUTHENTICATION": settings.REST_FRAMEWORK.get(
            "DEFAULT_AUTHENTICATION_CLASSES", []
        ),
        "DEFAULT_PERMISSION": settings.REST_FRAMEWORK.get(
            "DEFAULT_PERMISSION_CLASSES", []
        ),
        "ALLOWED_HOSTS": settings.ALLOWED_HOSTS,
        "CORS_ALLOWED_ORIGINS": getattr(settings, "CORS_ALLOWED_ORIGINS", []),
        "CSRF_TRUSTED_ORIGINS": getattr(settings, "CSRF_TRUSTED_ORIGINS", []),
        "URLS": [str(p.pattern) for p in urlconf.url_patterns][:20],  # first 20 url patterns
    })
