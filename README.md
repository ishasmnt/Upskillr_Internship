

# 🌟 UpSkillr – Online Learning & Skill Development Platform

**UpSkillr** is a modern **MERN-based Learning Management System (LMS)** designed for **instructor-led skill development**. It empowers instructors to create, manage, and update courses, lessons, assignments, videos, and notes, while allowing learners to explore courses, track progress, complete lessons, and access study materials in real time.

This platform demonstrates a **clean architecture**, **role-based access control**, **secure Firebase authentication**, and a **scalable modular design**.

---

## 📌 Project Overview

* **Project Title:** UpSkillr – Online Learning & Skill Development Platform
* **Project Code:** EDU-WEB-2025-088
* **Domain:** EdTech / Web Development
* **Project Type:** Full-Stack Web Application (MERN)

---

## 🎯 Objectives

* Develop a **MERN-based platform** supporting **Instructor** and **Learner** roles
* Implement **secure authentication** using **Firebase Authentication**
* Enable instructors to **create, edit, and manage courses, lessons, assignments, and notes**
* Allow learners to **enroll in courses, track progress, submit assignments, and access study materials**
* Ensure **scalable, modular, and maintainable folder structure**
* Follow **industry-standard GitHub workflow** and documentation

---

## 🛠 Technology Stack

**Frontend**

* React.js
* Tailwind CSS / CSS
* Axios for API calls
* Firebase Authentication SDK

**Backend**

* Node.js & Express.js
* MongoDB with Mongoose
* Firebase Admin SDK for token verification

**Authentication & Authorization**

* Firebase Authentication for secure user login/sign-up
* Firebase ID tokens verified by backend
* Role-based access control: **Instructor** vs **Learner**

---

## 🔐 Authentication Flow

1. Users register/login via **Firebase Authentication**
2. Firebase generates a **secure ID token**
3. Token is sent with API requests to backend
4. Backend verifies token using **Firebase Admin SDK**
5. **Role-based access** ensures only instructors can manage content, learners access dashboards and study materials

---

## 📂 Project Folder Structure

```
UpSkillr/
│
├── frontend/
│   ├── public/                  # Static HTML files
│   ├── src/
│   │   ├── assets/              # Images, icons, and static resources
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-based page components
│   │   │   ├── Auth/            # Login & Registration
│   │   │   ├── Instructor/      # Instructor dashboard & course management
│   │   │   ├── Learner/         # Learner dashboard & course interaction
│   │   │   └── Home.jsx         # Landing page
│   │   ├── services/            # API calls and services
│   │   ├── context/             # Global state & authentication context
│   │   ├── utils/               # Helper functions & protected routes
│   │   └── App.jsx              # Main React router
│
├── backend/
│   ├── config/                  # DB & Firebase configuration
│   ├── models/                  # MongoDB schemas
│   ├── controllers/             # Business logic for courses, modules, assignments, notes
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Auth & role-based access middleware
│   └── server.js                # Backend entry point
│
├── .gitignore
└── README.md
```

---

## 🔁 Application Flow

### Instructor

1. Access dashboard → view courses, assignments, and notes
2. Create/edit/delete courses
3. Inside a course:

   * Add lessons/videos (modules)
   * Add assignments
   * Upload notes for learners
4. Track course updates

### Learner

1. Access dashboard → track progress and completed lessons
2. Browse course catalog → enroll in courses
3. Open enrolled courses → complete lessons/videos
4. Submit assignments
5. Access uploaded notes

---

## 🚀 How to Run

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🌟 Contributors

| Name                | Role                       |
| ------------------- | ---------------------------|
| Isha Samant         | Backend Developer          |
| Shraddha Desai      | Frontend Developer         |
| Prathamesh Nivalkar | Frontend+Backend Developer |
| Piyush Patil        | Resource found             |

---

## ✅ Key Features

* Full **Instructor & Learner Role Management**
* **Secure Firebase Authentication & Authorization**
* Dynamic **Course Creation & Module Management**
* **Assignment Submission & Progress Tracking**
* Clean & professional **UI/UX design**
* **Scalable folder structure** for future growth
