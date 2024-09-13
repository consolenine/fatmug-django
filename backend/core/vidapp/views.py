from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from knox.auth import TokenAuthentication

from .models import Video, Subtitle
from .serializers import VideoSerializer
from .pagination import StandardResultsSetPagination
from .tasks import extract_subtitles_task

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated,]
    pagination_class = StandardResultsSetPagination
    
    def get_permissions(self):
        # Allow unauthenticated access to the 'list' action
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        # Require authentication for all other actions
        return [IsAuthenticated()]
    
    def retrieve(self, request, pk=None):
        queryset = Video.objects.all()
        video = get_object_or_404(queryset, uuid=pk)
        serializer = VideoSerializer(video)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        video = serializer.save(user=request.user)

        # Trigger the background task to extract subtitles
        extract_subtitles_task.delay(video.id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
