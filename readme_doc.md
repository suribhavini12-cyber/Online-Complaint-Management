# Online Complaint Registration and Management System (OCRMS)
## Project Documentation

---

### 1. Introduction
* **Project Title**: Online Complaint Registration and Management System (OCRMS)
* **Team Members & Roles**:
  * **suribhavini12-cyber**: Full Stack Software Engineer (Frontend, Backend, Database, and Production Deployment)

---

### 2. Project Overview
* **Purpose**: 
  OCRMS is a production-ready, full-stack complaint management portal designed to streamline ticket submissions and resolution lifecycles. It uses workload-balanced routing algorithms to automatically assign incoming issues to specialized support agents, improving response time and operational efficiency.
* **Key Features**:
  * **Automated AI Routing**: Ingests categories (Technical, Billing, Service, Security, Other) and auto-assigns the ticket to the specialist with the lowest active ticket count.
  * **Real-time Live Chat**: Integrated Socket.io workspace enabling direct communication between customers and their assigned specialist.
  * **Visual Stepper Tracker**: A 5-stage progress indicator (`Pending` -> `Assigned` -> `In Progress` -> `Resolved` -> `Closed`) outlining handling details and assigned staff.
  * **Interactive Virtual Assistant**: A floating chatbot equipped with a synonym-based rule engine to answer FAQs (filing steps, SLAs, password reset) on demand.
  * **Premium Glassmorphic Design**: A responsive interface optimized for mobile, tablet, and desktop viewports, featuring subtle entry transitions and a dark theme.

---

### 3. Architecture
* **Frontend**: 
  * Built as a Single Page Application (SPA) using **React.js** and **Vite**.
  * UI components designed using **Material UI (MUI)**.
  * Staggered landing page and modal animations powered by **Framer Motion**.
  * Context-based global state management (`AuthContext`) and dynamic client routing with **React Router v7**.
* **Backend**:
  * Built as a RESTful API using **Node.js** and **Express.js**.
  * Live bi-directional chat socket connection enabled via **Socket.io**.
  * Dynamic email notification triggers powered by the **Resend API**.
* **Database**:
  * Persistent storage provided by **MongoDB Atlas** hosted on a cloud cluster.
  * Object Data Modeling (ODM) handled by **Mongoose**.
  * Key Schemas:
    * `User`: Stores user info, roles (`user`, `agent`, `admin`), and active workloads.
    * `Complaint`: Tracks titles, descriptions, priorities, statuses, categories, and coordinates (Address, State, City, Pincode).
    * `Message`: Logs real-time conversation histories between customers and support staff.
    * `Feedback`: Handles user reviews and 5-star ratings post-resolution.

---

### 4. Setup Instructions
* **Prerequisites**:
  * Node.js (v18.0.0 or higher)
  * npm (v9.0.0 or higher)
  * A MongoDB Atlas database cluster URI
  * A Resend Email API Key
  * A Google Cloud Console project with OAuth 2.0 Web Application credentials

* **Installation & Configuration**:
  1. Clone the repository:
     ```bash
     git clone https://github.com/suribhavini12-cyber/Online-Complaint-Management.git
     cd Online-Complaint-Management
     ```
  2. Install client and server dependencies:
     ```bash
     npm run install:all
     ```
  3. Create your backend configuration file inside [server/.env](file:///Users/sushank's macbook/Project(inten)/server/.env):
     ```env
     PORT=5001
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/onlinecomplaint
     JWT_SECRET=supersecretkeyocrms2024
     NODE_ENV=development
     GOOGLE_CLIENT_ID=<your-id>.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=<your-secret>
     RESEND_API_KEY=re_your_api_key
     FROM_EMAIL=onboarding@resend.dev
     FROM_NAME=OCRMS Support
     ```
  4. Create your frontend configuration file inside [client/.env](file:///Users/sushank's macbook/Project(inten)/client/.env):
     ```env
     VITE_GOOGLE_CLIENT_ID=<your-id>.apps.googleusercontent.com
     ```

---

### 5. Folder Structure
* **Client (React Frontend)**:
  * `client/src/components/`: Reusable components (Navbar, Sidebar navigation, Chatbot).
  * `client/src/context/`: Global providers (`AuthContext` for credentials).
  * `client/src/pages/`: Views (Login, Register, Dashboard views, CreateComplaint, ComplaintTracking).
  * `client/src/theme.js`: Tailored MUI colors and fonts.
* **Server (Express Backend)**:
  * `server/controllers/`: Route handlers (Auth, Complaints, Feedback).
  * `server/models/`: Database schemas (User, Complaint, Message, Feedback).
  * `server/routes/`: Router endpoints.
  * `server/utils/`: Seeder scripts and email helper utilities.
  * `server/server.js`: Server startup, middleware, and Socket.io registration.

---

### 6. Running the Application
* **To run concurrently (recommended)**:
  Execute this command from the root project directory to boot both environments:
  ```bash
  npm run dev
  ```
* **To run manually**:
  * **Start Backend API Server**:
    ```bash
    cd server
    npm run dev
    ```
  * **Start Frontend Dev Server**:
    ```bash
    cd client
    npm run dev
    ```

---

### 7. API Documentation
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Create a new customer profile | No |
| **POST** | `/api/auth/login` | Email + Password sign-in | No |
| **POST** | `/api/auth/google` | Google Access Token validation | No |
| **GET** | `/api/complaints` | Fetch complaints matching user role | Yes (User/Agent/Admin) |
| **POST** | `/api/complaints` | Register a new complaint & auto-route | Yes (User only) |
| **PUT** | `/api/complaints/:id/status` | Update resolution step | Yes (Agent/Admin) |
| **GET** | `/api/feedback/:id` | Fetch rating review for a ticket | Yes (User/Agent/Admin) |
| **POST** | `/api/feedback` | Post 5-star rating post-resolution | Yes (User only) |

---

### 8. Authentication
* **Role-Based Token Verification**:
  * Standard logins issue a **JSON Web Token (JWT)** containing roles (`user`, `agent`, `admin`).
  * Tokens are stored locally on the client and appended to outgoing requests. Middleware checks roles before allowing database access.
* **Google OAuth Pop-up Authentication**:
  * Connects using `@react-oauth/google` buttons on the frontend.
  * The server verifies the token with Google APIs, matching emails, or auto-generating account profiles if registering for the first time.

---

### 9. User Interface
* **Landing Page**: Glassmorphic layout showing FAQ accordions, feature cards, and calls-to-action.
* **Filing Workspace**: Clean form validating address inputs, pincodes, categories, and selecting dynamic cities based on the chosen State.
* **Agent Dashboard**: Real-time stats listing active workload totals, pending tasks, and direct chat links.

---

### 10. Testing
* **Static Verification**:
  * Production bundles are validated using Vite compilation commands (`npm run build`) to confirm syntax and type definitions.
* **Interface Testing**:
  * Cross-browser and responsive testing conducted manually to verify phone screen overlays and chatbot scrollbars.

---

### 11. Screenshots or Demo
* 🌐 **Live Web Application (Vercel)**: [https://online-complaint-management.vercel.app](https://online-complaint-management.vercel.app)
* ⚙️ **Backend API Service (Render)**: [https://online-complaint-management-ggyd.onrender.com](https://online-complaint-management-ggyd.onrender.com)

---

### 12. Known Issues
* **Inactivity Spin-down**:
  Render and MongoDB Atlas free-tier servers spin down after 15 minutes of inactivity. The very first request to the backend or database might take 50 seconds to complete while services wake up.

---

### 13. Future Enhancements
* **Multi-Language Localization**: Translating interface screens for diverse language groups.
* **Vector Similarity Matching**: Storing past complaint patterns to automatically suggest instant resolutions for similar new tickets.
