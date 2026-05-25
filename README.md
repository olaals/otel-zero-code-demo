# WeatherWatch - OTel Zero-Code Instrumentation Demo

A full-stack weather application demonstrating OpenTelemetry zero-code (automatic) instrumentation for .NET. No OTel SDK packages or code changes required -- the auto-instrumentation agent is injected at the Docker image level.

## Tech Stack

- **Backend:** ASP.NET Core 8 Web API
- **Frontend:** React 18 + Vite + Equinor EDS
- **Database:** PostgreSQL 16
- **Observability:** OpenTelemetry .NET Auto-Instrumentation + Aspire Dashboard

## Ports

| Service          | URL                        | Description                        |
| ---------------- | -------------------------- | ---------------------------------- |
| App              | http://localhost:8080       | WeatherWatch application           |
| Aspire Dashboard | http://localhost:18888      | Traces, structured logs, metrics   |
| PostgreSQL       | localhost:5433              | Database (user/pass: weatherwatch) |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (with Compose)
- [Task](https://taskfile.dev/) (optional, for convenience commands)

## Run

With Task:

```sh
task run
```

Or directly with Docker Compose:

```sh
docker compose up --build -d
```

## Stop

```sh
task down
```

Or:

```sh
docker compose down
```

## Other Commands

```sh
task urls    # Print clickable service URLs
task logs    # Follow app container logs
```
