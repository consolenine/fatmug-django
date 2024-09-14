from django.conf import settings

from rest_framework import serializers
from .models import Video, Subtitle

class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ['id', 'language']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['url'] = f'/api/vidapp/subtitle/{instance.video.uuid}/{instance.id}/?of=vtt'
        return representation
        
class VideoSerializer(serializers.ModelSerializer):
    subtitles = SubtitleSerializer(many=True, read_only=True)
    class Meta:
        model = Video
        fields = ['uuid', 'status', 'title', 'video_file', 'uploaded_at', 'thumbnail', 'subtitles']
        extra_kwargs = {
            'uuid': {'read_only': True},
            'uploaded_at': {'read_only': True},
            'thumbnail': {'read_only': True}
        }
    
    def validate(self, attrs):
        # Check video less than configured limit
        video_file = attrs.get('video_file')
        if video_file and video_file.size > settings.DATA_UPLOAD_MAX_MEMORY_SIZE:
            raise serializers.ValidationError({
                'video_file': f"File size should not exceed {settings.DATA_UPLOAD_MAX_MEMORY_SIZE / (1024 * 1024)} MB."
            })
        return attrs
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['thumbnail'] = settings.MEDIA_URL + representation['thumbnail']
        return representation