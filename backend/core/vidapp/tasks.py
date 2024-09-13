import os
import subprocess
import glob

from django.conf import settings
from .models import Video, Subtitle
from celery import shared_task

@shared_task
def extract_subtitles_task(video_id):
    # Fetch the video object
    video = Video.objects.get(id=video_id)
    video_path = os.path.join(settings.MEDIA_ROOT, video.video_file.name)

    # Generate base path for subtitle output, without the extension
    base_output_path = video_path.rsplit('.', 1)[0]

    # Run CCExtractor on the video file to extract subtitles
    # https://ccextractor.org/public/general/command_line_usage/
    subprocess.run(['ccextractor', video_path, '-o', base_output_path])

    subtitle_files = glob.glob(f"{base_output_path}_*.srt")

    for subtitle_file in subtitle_files:
        language_code = subtitle_file.rsplit('_', 1)[-1].split('.')[0]

        # Read the subtitle content from the file
        with open(subtitle_file, 'r', encoding='utf-8') as f:
            subtitle_content = f.read()

        Subtitle.objects.create(
            video=video,
            language=language_code,
            data=subtitle_content
        )
