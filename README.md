# Full Stack Book Review Platform

![image](https://github.com/user-attachments/assets/79e1ee3e-947c-40a2-b587-ee1b60fa43e5)

## Objective

A full-stack web application where users can browse books, read and write reviews, and rate books. The application features a React frontend and a Node.js backend using Express and MongoDB.

---

## Tech Stack

*   **Frontend:**
    *   React
    *   Redux Toolkit for state management
    *   React Router for navigation
    *   Material-UI (MUI) for components and styling
    *   Axios for API requests

*   **Backend:**
    *   Node.js
    *   Express.js for the RESTful API
    *   MongoDB for the database
    *   Mongoose for object data modeling
    *   JSON Web Tokens (JWT) for authentication

---

## Features

*   User authentication (Register, Login, Logout)
*   Browse a list of all books with search and filter capabilities
*   View detailed information for a single book, including user reviews
*   Submit, edit, and delete book reviews
*   User dashboard to view profile information and manage account settings
*   Responsive design for a seamless experience on all devices

---

## Project Setup

### Prerequisites

*   Node.js and npm (or yarn)
*   MongoDB (local instance or a cloud service like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd book-review-platform/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd book-review-platform/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.
