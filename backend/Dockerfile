# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app/backend
COPY backend/WeatherWatch.csproj ./
RUN dotnet restore
COPY backend/ ./
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/publish ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot/

RUN apt-get update && apt-get install -y curl unzip 

# Install OpenTelemetry .NET Automatic Instrumentation
ARG OTEL_VERSION=1.9.0
RUN curl -sSfL https://github.com/open-telemetry/opentelemetry-dotnet-instrumentation/releases/download/v${OTEL_VERSION}/otel-dotnet-auto-install.sh -O \ 
&& sh ./otel-dotnet-auto-install.sh

# Enable execution for the instrumentation script
RUN chmod +x $HOME/.otel-dotnet-auto/instrument.sh

# Setup the instrumentation for the current shell session
RUN . $HOME/.otel-dotnet-auto/instrument.sh

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", ". /root/.otel-dotnet-auto/instrument.sh && dotnet WeatherWatch.dll"]
