import os
import subprocess
import json

from django.conf import settings
from .models import Video, Subtitle
from celery import shared_task

def extract_thumbnail(video_path, output_path):
    # Step 1: Get video duration using ffprobe
    ffprobe_command = [
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=nw=1:nk=1', video_path
    ]

    try:
        result = subprocess.run(ffprobe_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        duration = int(float(result.stdout.strip()))

        # Determine the timestamp for frame capture
        if duration <= 30:
            timestamp = '00:00:01'
        else:
            timestamp = '00:00:30'
        print(timestamp, duration)

        # Step 2: Capture the frame using ffmpeg
        ffmpeg_command = [
            'ffmpeg', '-i', video_path, '-ss', timestamp, '-frames:v', '1', output_path
        ]
        
        # Execute the ffmpeg command
        result = subprocess.run(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        
        # Check if output file was created
        if os.path.exists(output_path):
            print(f"Thumbnail saved at {output_path}")
            return True
        else:
            print(f"Failed to save thumbnail. Output file not created.")
            return False
    
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def extract_title(video_path):
    ffprobe_command = [
        'ffprobe', '-v', 'error', '-show_entries', 'format_tags=title',
        '-of', 'default=nw=1:nk=1', video_path
    ]

    try:
        result = subprocess.run(ffprobe_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        title = result.stdout.strip()
        return title
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        return None

def extract_subtitles(video, video_path):
    try:
        # Use `ffprobe` to detect all subtitle tracks
        ffprobe_command = [
            'ffprobe', '-v', 'error', '-of', 'json', video_path, 
            '-show_entries', 'stream=index:stream_tags=language', 
            '-select_streams', 's'
        ]

        # Run ffprobe to gather all subtitle tracks
        result = subprocess.run(ffprobe_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        subtitle_info = json.loads(result.stdout)

        # Check if subtitles are available
        if 'streams' not in subtitle_info:
            print(f"No subtitles found in video: {video.title}")
            return

        for stream in subtitle_info['streams']:
            subtitle_index = stream['index']
            language = stream['tags'].get('language', f'unknown{subtitle_index}')
            
            try:
                ffmpeg_command = [
                    'ffmpeg', '-i', video_path, 
                    '-map', f'0:{subtitle_index}', '-f', 'srt', 'pipe:1'
                ]
                
                result = subprocess.run(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
                subtitle_data = result.stdout.decode('utf-8')
                
                Subtitle.objects.create(
                    video=video,
                    language=language,
                    data=subtitle_data,
                ) 
                print(f"Subtitle extracted and saved for language: {language}")
            except subprocess.CalledProcessError as e:
                print(f"Error extracting subtitle track {subtitle_index}: {e}")
    
    except subprocess.CalledProcessError as e:
        print(f"Error running ffprobe: {e}")

@shared_task
def process_video_task(video_id):
    # Retrieve the video object
    video = Video.objects.get(id=video_id)
    video_path = os.path.join(settings.MEDIA_ROOT, video.video_file.name)
    
    thumbnail_dir = os.path.join(settings.MEDIA_ROOT, "thumbnails")
    os.makedirs(thumbnail_dir, exist_ok=True)
    
    thumbnail_path = os.path.join(thumbnail_dir, f"{video.uuid}.jpg")
    thumbnail_saved = extract_thumbnail(video_path, thumbnail_path)
    if thumbnail_saved:
        video.thumbnail = "thumbnails/" + f"{video.uuid}.jpg"
        video.save()
    
    video_title = extract_title(video_path)
    if video_title:
        video.title = video_title
        video.save()
    
    extract_subtitles(video, video_path)
