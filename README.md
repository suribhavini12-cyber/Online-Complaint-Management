# Online Complaint Registration and Management System (OCRMS)

Welcome to the OCRMS repository! This is a production-grade, full-stack complaint registration and management application built using the MERN stack (MongoDB, Express.js, React, Node.js) with integrated NLP AI classification for automated agent routing.

---

## 🔗 Live Demo & Test Credentials

You can access the live deployment of the application:

* 🌐 **OCRMS Web Application (Vercel)**: `https://<your-vercel-domain>.vercel.app` *(To be populated upon deployment)*
* ⚙️ **Backend REST API (Render)**: `https://ocrms-backend.onrender.com` *(To be populated upon deployment)*

### 🔑 Pre-seeded Test Accounts

All accounts use the default password: `password123`

1. **Administrator Account** (Full analytics, dashboard counters, and user role management):
   * **Email**: `admin@ocrms.com`
   * **Password**: `password123`

2. **Customer Account** (Complaint submission, real-time ticket tracking, agent chat, and feedback):
   * **Email**: `user@ocrms.com`
   * **Password**: `password123`

3. **Support Agent Accounts** (Sector-specific handlers allocated automatically by the AI Router):
   * **Technical Specialist**: `tech_agent@ocrms.com` / `password123`
   * **Billing Specialist**: `billing_agent@ocrms.com` / `password123`
   * **Service Specialist**: `service_agent@ocrms.com` / `password123`
   * **Security Specialist**: `security_agent@ocrms.com` / `password123`
   * **General Specialist**: `general_agent@ocrms.com` / `password123`

*(You can also register a new customer account directly on the sign-up page)*

---

## ✨ Advanced Interactive Features

Recently, we've implemented several premium features to significantly improve user experience and operational visibility:

1. **Step-by-Step Filing Guide Page**: Mapped to the `/guide` route, this page provides a visual timeline explaining the complaint lifecycle (from submission and workload-based auto-routing to agent chat workspace and final rating resolution). Fully accessible in both public guest mode and authenticated sidebar layouts.
2. **Persistent Virtual Chatbot Assistant**: A floating, responsive virtual assistant integrated across the application. It parses natural query synonyms (e.g. *give*, *lodge*, *raise*, *track progress*, *expected SLA*) and provides context-aware guidance and instant answers, along with quick suggestion question pills.
3. **Interactive Complaint Tracking Dashboard**: Mapped to `/dashboard/track`, this feature provides a visual 5-stage stepper (`Pending` -> `Assigned` -> `In Progress` -> `Resolved` -> `Closed`) details about the handling authority (e.g. specialized departments and assigned agent name), and search utility to track any 24-character complaint ID.
4. **Improved Homepage UI & FAQs**: Modern glassmorphic landing sections with clean visual aesthetics, CTA guides, and a responsive FAQ accordion explaining auto-assignment, workspace chats, and status tracking.
5. **Responsive Dual Drawer Navigation**: The drawer system dynamically adjusts for different screen sizes:
   * **Phone/Tablet View (< 600px)**: Sidebar displays as a temporary overlay, sliding gracefully on top of the content without pushing it. Selects close the drawer automatically.
   * **Desktop View (>= 600px)**: Sidebar renders inline as a permanent sidebar.

---

## 📂 Project Architecture & Schemas

The application is structured around a multi-model database design linking customers, specialists, real-time messaging, and complaint lifecycles:

* **Users Schema** - Handles role management (`user`, `agent`, `admin`) and workload metrics for specialist agents.
* **Complaints Schema** - Tracks complaint titles, details, priority, dynamic status updates, and links to assigned sector agents.
* **Agent Assignment Schema** - Logs routing statistics and assignment parameters.
* **Feedback Schema** - Manages 5-star ratings and textual reviews left by customers after resolution.
* **Real-time Messages Schema** - Preserves persistent Socket.io chat history.

---

## 🛠️ Repository Layout

The repository is structured as a decoupled monorepo:

* [client/](file:///Users/sushank's macbook/Project(inten)/client): React.js frontend client SPA built with Vite and styled with Material UI (MUI).
* [server/](file:///Users/sushank's macbook/Project(inten)/server): Node.js/Express.js backend REST API, utilizing Mongoose models and Socket.io for live chats.

---

## 🚀 How to Run Locally

Follow these steps to configure and execute the application on your local machine:

### 1. Configure Environment Variables

#### Backend Server Configurations
Create a `.env` file inside the [server/](file:///Users/sushank's macbook/Project(inten)/server) directory:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/onlinecomplaint
JWT_SECRET=supersecretkeyocrms2024
NODE_ENV=development

# Google OAuth Setup
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Email Configuration (Resend/SMTP)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=onboarding@resend.dev
FROM_NAME=OCRMS Support
```

#### Frontend Client Configurations
Create a `.env` file inside the [client/](file:///Users/sushank's macbook/Project(inten)/client) directory:
```env
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
```

---

### 2. Quick Setup & Run (Root Scripts)

If you have Node.js and npm installed globally, you can set up and run the entire application using root commands:

```bash
# 1. Install all dependencies across client and server
npm run install:all

# 2. Seed database with default admin, user, and agent specialist accounts
npm run seed

# 3. Launch both backend API and React client concurrently
npm run dev
```
* Frontend Client will launch on: [http://localhost:5173](http://localhost:5173)
* Backend API Server will run on: [http://localhost:5001](http://localhost:5001)

---

### 3. Alternative Manual Execution

Alternatively, you can run client and server processes in separate terminal instances:

#### To start the backend API:
```bash
cd server
npm install
npm run seed   # (If running for the first time to seed user/agent accounts)
npm run dev
```

#### To start the frontend React app:
```bash
cd client
npm install
npm run dev
```
