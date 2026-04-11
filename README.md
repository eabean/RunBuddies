# RunBuddies

A running partner matching app. Users can create profiles, swipe on other runners, match, and message each other.

## Tech Stack

- **Backend:** ASP.NET Core (.NET 10) Web API
- **Database:** PostgreSQL
- **Auth:** JWT Bearer tokens
- **Docs:** Swagger UI (available in Development)

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/) (running locally or via a connection string)
- [dotnet-ef CLI tool](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

Install the EF Core CLI tool if you haven't already:

```bash
dotnet tool install --global dotnet-ef
```

## Setup

### 1. Configure the database connection

Create `Service/appsettings.Development.json` with your PostgreSQL connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=runbuddies;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  },
  "JwtSettings": {
    "Secret": "PoSrsED9ZQPvTsLKaWdXNMv273OJmN/nlk9SxRwqLU0=",
    "Issuer": "RunBuddies",
    "Audience": "RunBuddies",
    "ExpirationMinutes": 60
  }
}
```

> `appsettings.Development.json` is gitignored — do not commit secrets.

### 2. Run database migrations

From the `Service` directory:

```bash
cd Service
dotnet ef database update
```

This creates the database schema and seeds the default prompt questions.

### 3. Run the API

```bash
dotnet run --project Service
```

The API will be available at:

- **HTTP:** `http://localhost:5137`
- **HTTPS:** `https://localhost:7235`
- **Swagger UI:** `http://localhost:5137/swagger`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| POST | `/api/auth/refresh` | No | Refresh a JWT |

Authenticated endpoints require the `Authorization: Bearer <token>` header.
