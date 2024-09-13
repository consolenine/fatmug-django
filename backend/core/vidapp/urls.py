from .views import VideoViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'video', VideoViewSet)

urlpatterns = router.urls
