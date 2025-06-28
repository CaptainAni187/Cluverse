# Cluverse
Weaving club constellations into one campus galaxy. 🌌

## Project Overview
Cluverse is a modern event and club management platform designed for campuses. It provides a seamless experience for students, club admins, and the Campus Welfare Officer (CWO) to manage events, registrations, approvals, and club activities.

## Features
- Role-based dashboards for students, admins, and CWO.
- Event creation, editing, and approval workflow.
- Event registration with QR code verification.
- Club admin approval by CWO.
- Responsive UI with a blue-themed design.
- Notifications, bookmarks, achievements, and calendar integration.

## Technologies Used
- **Frontend:** React with Vite, React Router, Tailwind CSS, React Icons.
- **Backend:** Node.js with Express, MongoDB with Mongoose.
- **Authentication:** JWT-based with role-based access control.

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- MongoDB instance running.

### Backend Setup
1. Navigate to the backend directory.
2. Install dependencies:
*npm install*
3. Configure environment variables (e.g., MongoDB URI, JWT secret) in a `.env` file.
4. Start the server:
*npm run dev*

### Frontend Setup
1. Navigate to the frontend directory.
2. Install dependencies:
*npm install*
3. Start the development server:
*npm run dev*

## Usage
- Register as a student or club admin.
- Club admins can create event requests via the "Host Event" page.
- CWO reviews and approves/rejects event requests.
- Students can browse and register for approved events.
- Admins can edit their events and resubmit if changes are requested.

## Future Implementations
- Global state management with React Context or Redux.
- Enhanced error handling and user feedback with toasts.
- Accessibility improvements and ARIA compliance.
- Automated testing for frontend and backend.
- Deployment pipeline with CI/CD.
- Real-time notifications and chat features.
- Advanced analytics and reporting for CWO.
