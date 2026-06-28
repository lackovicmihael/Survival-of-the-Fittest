from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({
        'status': 'ok',
        'project': 'Survival of the Fittest',
        'api': '/api/'
    })


urlpatterns = [
    path('', health_check),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
