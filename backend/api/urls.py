from django.urls import path
from .views import debug_view

urlpatterns = [
    path("debug/", debug_view, name="debug"),   # <— /api/debug/
    # ... your other endpoints ...
]
