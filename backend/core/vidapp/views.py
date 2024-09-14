from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from rest_framework import views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from knox.auth import TokenAuthentication

from .models import Video, Subtitle
from .serializers import VideoSerializer
from .pagination import StandardResultsSetPagination
from .tasks import process_video_task

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated,]
    pagination_class = StandardResultsSetPagination
    
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        
        return [IsAuthenticated()]
    
    def retrieve(self, request, pk=None):
        queryset = Video.objects.all()
        video = get_object_or_404(queryset, uuid=pk)
        if video.status == "PENDING":
            return Response({
                "status": "PENDING", 
                "message": "Video is still being processed. Please try again later."
            }, status=status.HTTP_200_OK)
        serializer = VideoSerializer(video)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        video = serializer.save(user=request.user)

        # Trigger the background task to extract subtitles
        process_video_task.delay(video.id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Custom action to get videos added by the current user
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        # Filter videos by the user
        user_videos = Video.objects.filter(user=request.user)
        page = self.paginate_queryset(user_videos)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(user_videos, many=True)
        return Response(serializer.data)

class SubtitleServeView(views.APIView):
    permission_classes = [AllowAny]

    def srt_to_vtt(self, srt_data):
        vtt_data = "WEBVTT\n\n"  # VTT files start with this header
        lines = srt_data.splitlines()
        for line in lines:
            # Replace commas with periods for the timestamp format
            if "-->" in line:
                line = line.replace(",", ".")
            vtt_data += line + "\n"
        return vtt_data

    def get(self, request, video_uuid, sub_id):
        subtitle = get_object_or_404(Subtitle, id=sub_id, video__uuid=video_uuid)
        of = request.query_params.get('of', 'raw')
        if of == 'vtt':
            vtt_data = self.srt_to_vtt(subtitle.data)
            
            response = HttpResponse(vtt_data, content_type='text/vtt')
            response['Content-Disposition'] = f'attachment; filename="{video_uuid}_{subtitle.language}.vtt"'
            return response
        elif of == 'srt':
            response = HttpResponse(subtitle.data, content_type='text/srt')
            response['Content-Disposition'] = f'attachment; filename="{video_uuid}_{subtitle.language}.srt"'
            return response
        
        return Response(subtitle.data, status=status.HTTP_200_OK)