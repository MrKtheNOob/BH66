# BH66 Backend + Lab

This repository is split into two clear workspaces:

- `backend/`: production-oriented Django + Django Ninja API.
- `lab/`: inference playground (MediaPipe Tasks prototype) used by backend services.

## Structure

- `backend/config/`: Django settings, URLs, Ninja API bootstrap.
- `backend/users/`: custom user model.
- `backend/measurements/`: profiles, values, service layer, profile API routes.
- `backend/media/`: measurement image model and media scaffolding.
- `backend/orders/`: optional order scaffold.
- `lab/src/sewing_inference/`: OOP inference engine used by backend measurement service.
- `lab/input/`, `lab/output/`: local experimentation I/O.

## Setup

```bash
uv sync
uv add django django-ninja pillow mediapipe opencv-python jupyter
```

For Cloudinary media storage on Render:

```bash
uv add cloudinary django-cloudinary-storage
```

Set model path for MediaPipe Tasks:

```bash
export MEDIAPIPE_POSE_MODEL=/absolute/path/to/pose_landmarker.task
```

## Run Backend

```bash
uv run python backend/manage.py migrate
uv run python backend/manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

## Media Provider Config

Local (default):

```bash
MEDIA_PROVIDER=local
```

Cloudinary:

```bash
MEDIA_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Main endpoints:
- `POST /api/profiles`
- `POST /api/profiles/{id}/images`
- `POST /api/profiles/{id}/analyze`
- `PATCH /api/profiles/{id}/measurements`
- `GET /api/profiles/{id}`
- `GET /api/profiles`

Auth/User endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users` (admin only)
- `GET /api/users/{id}` (self or admin)

Use header: `Authorization: Bearer <access_token>`
Refresh tokens are stored in an HttpOnly cookie and are sent automatically on `POST /api/auth/refresh` and `POST /api/auth/logout`.

## Run Lab

```bash
uv run python lab/scripts/infer.py --image lab/input/input.webp --height 178 --out lab/output/front.json
uv run jupyter notebook
```
