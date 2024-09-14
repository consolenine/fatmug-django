from django.urls import path, include

from .views import VideoViewSet, SubtitleServeView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'video', VideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('subtitle/<uuid:video_uuid>/<int:sub_id>/', SubtitleServeView.as_view(), name='subtitle-serve'),
]
