#!/bin/bash

# API Testing Script

API_URL="http://localhost:3001"

echo "================================================"
echo "  TodoList API - Testing Script"
echo "================================================"
echo ""

# Health Check
echo "1️⃣  Health Check"
curl -s -X GET "$API_URL/health" | jq . || echo "❌ API not responding"
echo ""
echo ""

# Create Task
echo "2️⃣  Creating a Task"
TASK_ID=$(curl -s -X POST "$API_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Learn Docker",
    "description": "Master Docker containerization"
  }' | jq '.id')

echo "Created task with ID: $TASK_ID"
echo ""
echo ""

# Get All Tasks
echo "3️⃣  Getting All Tasks"
curl -s -X GET "$API_URL/api/tasks" | jq .
echo ""
echo ""

# Get Specific Task
echo "4️⃣  Getting Specific Task (ID: $TASK_ID)"
curl -s -X GET "$API_URL/api/tasks/$TASK_ID" | jq .
echo ""
echo ""

# Update Task
echo "5️⃣  Marking Task as Completed"
curl -s -X PUT "$API_URL/api/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }' | jq .
echo ""
echo ""

# Create Another Task
echo "6️⃣  Creating Another Task"
TASK_ID_2=$(curl -s -X POST "$API_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Push to Docker Hub",
    "description": "Upload images to Docker Hub registry"
  }' | jq '.id')

echo "Created task with ID: $TASK_ID_2"
echo ""
echo ""

# Get All Tasks Again
echo "7️⃣  Getting All Tasks (After Creation)"
curl -s -X GET "$API_URL/api/tasks" | jq .
echo ""
echo ""

# Delete Task
echo "8️⃣  Deleting a Task"
curl -s -X DELETE "$API_URL/api/tasks/$TASK_ID_2" | jq .
echo ""
echo ""

# Final List
echo "9️⃣  Final Task List"
curl -s -X GET "$API_URL/api/tasks" | jq .
echo ""
echo ""

echo "================================================"
echo "  ✅ API Testing Complete!"
echo "================================================"
