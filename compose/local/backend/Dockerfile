# First stage: build environment
FROM python:3.12-bookworm

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /usr/src/app

# Install dependencies required for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    clang \
    libtesseract-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Rust and Cargo
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Gpac
RUN git clone https://github.com/gpac/gpac.git && \
    cd gpac && \
    ./configure && \
    make && \
    make install

# Install CCExtractor
RUN wget https://github.com/CCExtractor/ccextractor/archive/master.zip && \
    unzip master.zip && \
    cd ccextractor-master/linux/ && \
    ./build && \
    cp ccextractor /usr/local/bin

# Copy only requirements files and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Supervisor configuration
COPY supervisord.conf /etc/supervisor/supervisord.conf

# Expose the application port
EXPOSE 8000

# Command to start Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
