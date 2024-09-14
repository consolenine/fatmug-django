# Django Assignment for Fatmug

This repository contains files for the Django assignment as per the requirements at [GitLab Fatmug](https://gitlab.fatmug.co.in/fatmug-public/django-assignment/-/tree/main?ref_type=heads)

## Features

- REST API (using Django Rest Framework)
- Authentication (Django Rest Knox)
- Django Admin
- React Frontend (Vite + ChakraUI)
- Dockerized Development Environment

## Installation and Setup (Development Environment)

### Requirements

- Docker latest version ([Install Docker](https://docs.docker.com/get-docker/))

### Steps

1. Clone the repository
```bash
git clone https://github.com/consolenine/fatmug-django.git
```

2. Change directory to the project folder
```bash
cd fatmug-django
```

3. Build the docker image
```bash
docker compose build
```

4. Run the docker container
```bash
docker compose up -d
```

5. Create superuser for Django Admin (optional)
```bash
docker compose exec backend python manage.py createsuperuser
```

6. Access the Django Admin at [http://localhost:8000/admin/](http://localhost:8000/admin/)

7. Access the API at [http://localhost:8000/api/](http://localhost:8000/api/)

8. Access the application at [http://localhost:3000/](http://localhost:3000/)

9. Stop the docker container
```bash
docker compose down
```

### Monitor

- Logs are available at `logs` folder