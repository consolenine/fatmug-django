# First stage: build environment
FROM python:3.12-alpine

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /usr/src/app

# Install dependencies required for building
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Copy only requirements files and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Supervisor configuration
COPY supervisord.conf /etc/supervisor/supervisord.conf

# Expose the application port
EXPOSE 8000

# Command to start Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
