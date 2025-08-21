# 📋 API Verification Script

## Quick Verification with CURL Commands

Run these commands to verify the appointment booking API functionality:

### 1. Health Check
```bash
curl -X GET http://localhost:5001/api/health
```

### 2. Register a Patient
```bash
curl -X POST http://localhost:5001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login Patient
```bash
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the token from the response for the next commands!**

### 4. Get Available Slots
```bash
# Get slots for the next 7 days
TODAY=$(date +%Y-%m-%d)
NEXT_WEEK=$(date -d "+7 days" +%Y-%m-%d)

curl -X GET "http://localhost:5001/api/slots?from=${TODAY}&to=${NEXT_WEEK}"
```

### 5. Book a Slot
```bash
# Replace YOUR_TOKEN with the token from step 3
# Replace SLOT_ID with an available slot from step 4

curl -X POST http://localhost:5001/api/book \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "slotId": "SLOT_ID"
  }'
```

### 6. Get My Bookings
```bash
# Replace YOUR_TOKEN with the token from step 3

curl -X GET http://localhost:5001/api/my-bookings \
  -H "x-auth-token: YOUR_TOKEN"
```

### 7. Admin Access - Get All Bookings
```bash
# First, create and login as admin user
curl -X POST http://localhost:5001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Passw0rd!"
  }'

# Manually update user role in database (in production, this would be seeded)
# Then login as admin
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Passw0rd!"
  }'

# Get all bookings (replace ADMIN_TOKEN with admin token)
curl -X GET http://localhost:5001/api/all-bookings \
  -H "x-auth-token: ADMIN_TOKEN"
```

---

## Complete Workflow Script

Here's a bash script that runs the complete workflow:

```bash
#!/bin/bash

echo "🔍 Starting API verification..."

BASE_URL="http://localhost:5001/api"

# 1. Health check
echo "1. Health Check..."
curl -s $BASE_URL/health | jq .

# 2. Register user
echo -e "\n2. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@verify.com",
    "password": "password123"
  }')
echo $REGISTER_RESPONSE | jq .

# 3. Login user
echo -e "\n3. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@verify.com",
    "password": "password123"
  }')
echo $LOGIN_RESPONSE | jq .

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "🔑 Token: $TOKEN"

# 4. Get available slots
echo -e "\n4. Getting available slots..."
TODAY=$(date +%Y-%m-%d)
NEXT_WEEK=$(date -d "+7 days" +%Y-%m-%d 2>/dev/null || date -v +7d +%Y-%m-%d)

SLOTS_RESPONSE=$(curl -s "$BASE_URL/slots?from=$TODAY&to=$NEXT_WEEK")
echo $SLOTS_RESPONSE | jq '.[0:3]'  # Show first 3 slots

# Extract first slot ID
SLOT_ID=$(echo $SLOTS_RESPONSE | jq -r '.[0].id')
echo "📅 First available slot: $SLOT_ID"

# 5. Book the slot
echo -e "\n5. Booking slot..."
BOOK_RESPONSE=$(curl -s -X POST $BASE_URL/book \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -d "{\"slotId\": \"$SLOT_ID\"}")
echo $BOOK_RESPONSE | jq .

# 6. Get my bookings
echo -e "\n6. Getting my bookings..."
MY_BOOKINGS=$(curl -s -X GET $BASE_URL/my-bookings \
  -H "x-auth-token: $TOKEN")
echo $MY_BOOKINGS | jq .

echo -e "\n✅ API verification complete!"
```

## Expected Responses

### Health Check Response:
```json
{
  "status": "API is running!",
  "time": "2025-08-21T15:30:00.000Z"
}
```

### Register Response:
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### Login Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### Available Slots Response:
```json
[
  {
    "id": "2025-08-21T09:00:00.000Z",
    "start_time": "2025-08-21T09:00:00.000Z",
    "end_time": "2025-08-21T09:30:00.000Z"
  },
  // ... more slots
]
```

### Book Slot Response:
```json
{
  "id": 1,
  "user_id": 1,
  "slot_start_time": "2025-08-21T09:00:00.000Z",
  "created_at": "2025-08-21T15:30:00.000Z"
}
```

### My Bookings Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "slot_start_time": "2025-08-21T09:00:00.000Z",
    "created_at": "2025-08-21T15:30:00.000Z"
  }
]
```
