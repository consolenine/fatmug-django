from uuid import uuid4

from django.db import models    
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
   
def validate_video_extension(value):
    # List of allowed video extensions
    allowed_extensions = ['mp4', 'mov', 'mkv']
    extension = value.name.split('.')[-1].lower()
    if extension not in allowed_extensions:
        raise ValidationError('Unsupported video format.')
        
class Video(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="videos")
    status = models.CharField(max_length=50, default="PENDING")
    uuid = models.UUIDField(unique=True, db_index=True, default=uuid4, editable=False)
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to="videos/", validators=[validate_video_extension])
    thumbnail = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-uploaded_at"]
    
    def __str__(self):
        return self.title

class Subtitle(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="subtitles")
    language = models.CharField(max_length=50)
    data = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.video.title} - {self.language}"