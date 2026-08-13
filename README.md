# Student Management System

A full-stack Student Management System built with React, Node.js, Express.js and MongoDB.

## Features
- Dashboard with student count
- Add student
- View/search students
- Edit student
- Delete student
- MongoDB database
- REST API
- Responsive UI

## Requirements
- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string
- VS Code

## 1. Backend setup

Open terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_management
```

Then:

```bash
npm run dev
```

Backend runs at http://localhost:5000

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, usually http://localhost:5173

## API endpoints

GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id

## Student fields
- studentId
- name
- email
- phone
- dob
- gender
- course
- department
- semester
- address
