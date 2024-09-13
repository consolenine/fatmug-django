from rest_framework import serializers
from .models import Video, Subtitle

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['uuid', 'title', 'video_file', 'uploaded_at']
        extra_kwargs = {
            'uuid': {'read_only': True},
            'uploaded_at': {'read_only': True}
        }

class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ['id', 'language', 'data', 'created_at']