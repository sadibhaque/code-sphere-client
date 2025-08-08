# CodeSphere - Developer Community Platform

<img src="https://i.ibb.co.com/fYj4M1QC/image.png" alt="Banner" style="width:100%;"/>

## Live URLs

-   **Frontend:** [https://the-code-sphere.netlify.app/](https://the-code-sphere.netlify.app/)
-   **Backend:** [https://code-sphere-server-nu.vercel.app/](https://code-sphere-server-nu.vercel.app/)

## Project Overview

CodeSphere is a modern developer community platform where programmers can share knowledge, ask questions, and engage with content through posts, comments, and tags. The platform features a responsive UI with dark/light mode, role-based access, and a membership system.

## Key Features

### User Authentication & Profiles

-   Email/password and Google authentication
-   Role-based access (Admin, Gold, Bronze)
-   Profile management with membership status

### Content Creation & Discovery

-   Create, edit, and delete posts
-   Comment on posts with reporting functionality
-   Tag-based content organization and search
-   Advanced search capabilities

### Dashboard Features

-   **Admin Dashboard:** User management, post moderation, announcement creation
-   **User Dashboard:** Post management, comment tracking, membership upgrade

### Membership System

-   Bronze (free) and Gold (premium) tiers
-   Post limit for Bronze users (5 posts maximum)
-   Enhanced posting privileges for Gold users

### Responsive UI/UX

-   Modern, responsive design with Tailwind CSS
-   Dark/light mode support
-   Mobile-optimized layouts and navigation
-   Interactive components with hover effects

## Technologies Used

### Frontend

-   **Framework:** React.js with Vite
-   **Styling:** Tailwind CSS, Shadcn UI components
-   **State Management:** React Context API, TanStack Query
-   **Routing:** React Router DOM
-   **Authentication:** Firebase Authentication
-   **Forms:** React Hook Form with validation
-   **Notifications:** Sonner toast notifications

### Backend

-   **Runtime:** Node.js with Express.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JWT, Firebase Admin
-   **Hosting:** Vercel (backend), Firebase (frontend)

## NPM Packages

### Frontend Dependencies

```json
"dependencies": {
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-scroll-area": "^1.0.5",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-tooltip": "^1.0.7",
  "@tanstack/react-query": "^5.14.2",
  "axios": "^1.6.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "firebase": "^10.7.1",
  "lucide-react": "^0.294.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-hook-form": "^7.49.2",
  "react-router-dom": "^6.20.1",
  "sonner": "^1.2.4",
  "tailwind-merge": "^2.1.0",
  "tailwindcss-animate": "^1.0.7"
}
```

### Backend Dependencies

```json
"dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "firebase-admin": "^11.11.1",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.3.0",
  "stripe": "^14.8.0"
}
```

---

## 🛠️ Getting Started

1. Clone the Repository

    ```bash
    git clone https://github.com/sadibhaque/code-sphere-client.git
    ```

2. Install dependencies:

    ```bash
    cd code-sphere-client
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```


### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   MongoDB account
-   Firebase account

## Contributors

-   [Sadiqul Haque Sadib](https://github.com/sadibhaque)
