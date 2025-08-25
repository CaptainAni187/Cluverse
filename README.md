# Cluverse: Campus Club & Event Management

[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)

> Weaving club constellations into one campus galaxy. 🌌

**Cluverse** is a modern, full-stack event and club management platform designed to streamline campus life. It provides a seamless, role-based experience for students, club administrators, and the Campus Welfare Officer (CWO) to manage events, registrations, approvals, and all club-related activities in one centralized hub.


---

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture & Workflow](#system-architecture--workflow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Future Implementations](#future-implementations)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Key Features

-   **Role-Based Access Control (RBAC)**: Tailored dashboards and permissions for Students, Club Admins, and the Campus Welfare Officer (CWO).
-   **End-to-End Event Management**: A complete workflow for event creation, editing by admins, and a robust approval/rejection cycle managed by the CWO.
-   **Secure Event Registration**: Students can register for events, with QR code generation for secure, verifiable check-ins.
-   **Centralized Admin Management**: Club admin accounts require approval from the CWO, ensuring authorized access.
-   **Modern & Responsive UI**: A clean, intuitive interface built with Tailwind CSS, ensuring a great experience on any device.
-   **User Engagement Tools**: Features like event bookmarks, achievement tracking, and calendar integration to keep users engaged.

---

## Technology Stack

-   **Frontend**: **React (with Vite)**, **React Router** for navigation, and **Tailwood CSS** for styling.
-   **Backend**: **Node.js** with the **Express** framework.
-   **Database**: **MongoDB** with **Mongoose** for object data modeling.
-   **Authentication**: **JSON Web Tokens (JWT)** for secure, stateless user authentication and role-based access.

---

## System Architecture & Workflow

Cluverse operates on a client-server model with a clear, logical workflow for event management.

1.  **User Roles**:
    *   **Student**: Can view approved events, register, bookmark, and track their participation.
    *   **Club Admin**: Can create and manage events for their club, view registration data, and request approval from the CWO.
    *   **CWO (Campus Welfare Officer)**: Has oversight over all activities. Approves or rejects new club admin accounts and all event submissions.

2.  **Event Approval Workflow**:
    - A Club Admin submits a new event proposal. The event's status is set to `pending`.
    - The CWO sees the pending event in their dashboard and can either `approve` or `reject` it.
    - If rejected, the CWO can provide feedback, and the Club Admin can edit and resubmit.
    - Once `approved`, the event becomes visible to all students for registration.

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 16 or higher) and npm
-   [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based like MongoDB Atlas)
-   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```
    git clone https://github.com/CaptainAni187/Cluverse.git
    cd Cluverse
    ```

2.  **Set up the Backend:**
    ```
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add your configuration variables. Use `.env.example` as a template:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    PORT=8000
    ```
    Start the backend server:
    ```
    npm run dev
    ```

3.  **Set up the Frontend:**
    ```
    cd ../frontend
    npm install
    ```
    Start the frontend development server:
    ```
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port specified by Vite).

---

## Usage

1.  **Register** a new account as a Student or Club Admin.
2.  If registering as a **Club Admin**, your account must be approved by the CWO before you can host events.
3.  Once approved, a Club Admin can navigate to the **"Host Event"** page to create a new event request.
4.  The **CWO** can log in to view pending requests on their dashboard and take action.
5.  **Students** can browse all approved events on the main events page and register for them.

---

## API Endpoints

*(Optional: You can add a brief list of your key API endpoints here for developers who might want to interact with your backend.)*

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login a user
-   `POST /api/events` - Create a new event (Admin only)
-   `PUT /api/events/:id/approve` - Approve an event (CWO only)
-   `GET /api/events` - Get all approved events

---

## Future Implementations

-   **Global State Management**: Integrate **React Context** or **Redux Toolkit** for more efficient state management.
-   **User Feedback**: Implement a toast notification system (e.g., `react-hot-toast`) for better UX.
-   **Automated Testing**: Add unit and integration tests using **Jest** and **React Testing Library**.
-   **CI/CD Pipeline**: Automate testing and deployment using **GitHub Actions**.
-   **Real-time Features**: Add live chat for event pages or real-time notifications using **Socket.IO**.
-   **Advanced Analytics**: A dedicated analytics dashboard for the CWO to track club engagement and event attendance.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/CaptainAni187/Cluverse/issues).

---

## Author

**Animesh (CaptainAni187)**
-   **GitHub**: [@CaptainAni187](https://github.com/CaptainAni187)
-   **Project Repository**: [https://github.com/CaptainAni187/Cluverse](https://github.com/CaptainAni187/Cluverse)
