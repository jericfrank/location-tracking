# Location Tracking System

A real-time GPS location tracking system built with MQTT, Redis, PostgreSQL, and Fastify. This system receives location data from IoT devices via MQTT, stores the latest location in Redis for fast retrieval, and maintains a complete history in PostgreSQL.

## Architecture

The system consists of two main services:

- **Subscriber Service**: Listens to MQTT topics for incoming location data, caches the latest location in Redis, and persists all location history to PostgreSQL
- **API Service**: Provides REST endpoints to query device locations from Redis cache

## Tech Stack

- **Fastify** - High-performance web framework for the REST API
- **MQTT (EMQX)** - Message broker for receiving location data from devices
- **Redis** - In-memory cache for latest device locations
- **PostgreSQL** - Persistent storage for location history
- **TypeScript** - Type-safe development
- **Docker** - Containerized deployment

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
cd location-tracking
npm install
```

### 2. Start Infrastructure

Start all services using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- EMQX MQTT Broker (ports 1883, 8083, 18083)
- Redis (port 6379)
- PostgreSQL (port 5432)
- Redis Insight (port 5540)
- Adminer (port 8080)
- Subscriber Service
- API Service (port 3000)

### 3. Run Database Migrations

```bash
npm run migrate up
```

## API Endpoints

### Get Last Known Location

```http
GET /device/:id/last-location
```

Returns the most recent location for a device.

**Response:**
```json
{
  "deviceId": "device-123",
  "lat": 37.7749,
  "lng": -122.4194,
  "timestamp": 1701234567890
}
```

**Status Codes:**
- `200` - Success
- `404` - Device not found

## Publishing Location Data

Send location data to the MQTT broker on topic `location/{deviceId}`:

```javascript
// Example payload
{
  "deviceId": "device-123",
  "lat": 37.7749,
  "lng": -122.4194,
  "timestamp": 1701234567890
}
```

### Test Publisher

A test publisher script is included:

```bash
node pub_test.js
```

## Development

### Local Development

Run services individually:

```bash
# Start subscriber
npm run dev:subscriber

# Start API
npm run dev:api
```

### Database Migrations

```bash
# Create a new migration
npm run migrate create <migration-name>

# Run migrations
npm run migrate up

# Rollback migrations
npm run migrate down
```

## Management Interfaces

- **EMQX Dashboard**: http://localhost:18083 (default: admin/public)
- **Redis Insight**: http://localhost:5540
- **Adminer (PostgreSQL)**: http://localhost:8080
  - System: PostgreSQL
  - Server: postgres
  - Username: postgres
  - Password: password
  - Database: gps_db

## Project Structure

```
location-tracking/
├── src/
│   ├── api.ts          # Fastify REST API server
│   ├── subs.ts         # MQTT subscriber service
│   ├── mqtt.ts         # MQTT client configuration
│   ├── redis.ts        # Redis client configuration
│   ├── pg.ts           # PostgreSQL client configuration
│   └── types.ts        # TypeScript type definitions
├── migrations/         # Database migrations
├── docker-compose.yml  # Docker services configuration
├── api.Dockerfile      # API service container
├── subs.Dockerfile     # Subscriber service container
└── package.json
```

## Environment Variables

Configure via Docker Compose or `.env` file:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `MQTT_HOST` - MQTT broker host (default: localhost)
- `MQTT_PORT` - MQTT broker port (default: 1883)

## License

ISC
