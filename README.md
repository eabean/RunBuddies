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

### 1. Create an S3 bucket

1. Sign in to the [AWS Console](https://console.aws.amazon.com) and open **S3**.
2. Click **Create bucket** and give it a name (e.g. `run-buddies-s3-dev`).
3. Choose the AWS region closest to you (e.g. `us-west-2`). Note the region — you'll need it later.
4. Leave **Block all public access** enabled (uploads go through pre-signed URLs, not public reads).
5. Click **Create bucket**.

### 2. Create an IAM user with S3 access

1. Open **IAM → Users → Create user**.
2. Give it a name (e.g. `runbuddies-dev`) and click **Next**.
3. Choose **Attach policies directly**, then click **Create policy**.
4. Switch to the **JSON** editor and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

Replace `YOUR-BUCKET-NAME` with your actual bucket name. Save and attach this policy to the user.

5. After creating the user, go to **Security credentials → Access keys → Create access key**.
6. Choose **Application running outside AWS**, create the key, and save the **Access key ID** and **Secret access key** — you won't be able to see the secret again.

### 3. Configure S3 CORS

Without this, the browser will block direct uploads from the frontend.

1. Open your bucket in the AWS Console → **Permissions** tab → **Cross-origin resource sharing (CORS)**.
2. Click **Edit** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Add your production domain to `AllowedOrigins` when you deploy.

### 4. Configure the database connection and AWS credentials

Create `Service/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=runbuddies;Username=YOUR_PG_USER;Password=YOUR_PG_PASSWORD"
  },
  "JwtSettings": {
    "Secret": "PoSrsED9ZQPvTsLKaWdXNMv273OJmN/nlk9SxRwqLU0=",
    "Issuer": "RunBuddies",
    "Audience": "RunBuddies",
    "ExpirationMinutes": 10080
  },
  "AWS": {
    "BucketName": "YOUR-BUCKET-NAME",
    "Region": "us-west-2",
    "AccessKey": "YOUR-ACCESS-KEY-ID",
    "SecretKey": "YOUR-SECRET-ACCESS-KEY"
  }
}
```

> `appsettings.Development.json` is gitignored — do not commit secrets.

### 5. Run database migrations

From the `Service` directory:

```bash
cd Service
dotnet ef database update
```

This creates the database schema and seeds the default prompt questions.

### 6. Run the API

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
