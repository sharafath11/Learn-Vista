## CI/CD Setup

This repository now includes:

- `ci.yml`: server build + client type-check on push/PR.
- `cd.yml`: Docker build/push on push to `main`/`master` (and manual trigger).

### Required GitHub Secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Optional Secrets For Remote Deploy

- `DEPLOY_HOST`
- `DEPLOY_USERNAME`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT` (optional, defaults to `22`)

### Optional GitHub Variables

- `SERVER_IMAGE_NAME` (default: `sharafathst/learnvista-server`)
- `CLIENT_IMAGE_NAME` (default: `sharafathst/learnvista-client`)
- `CLIENT_NEXT_PUBLIC_BASEURL` (default: `https://api.learnvista.sharafathabi.cloud`)
- `ENABLE_REMOTE_DEPLOY` (`true` to enable deploy job)
- `DEPLOY_PATH` (server directory containing `docker-compose.yml`)
