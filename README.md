# Communication Tracking System

## Overview
This project provides a user and admin dashboard with calendar functionality, communication management, and notifications. It utilizes Firebase for backend services and authentication, Material UI for design, and FullCalendar for calendar features.

## Features
- **Admin Dashboard**: Manage companies and communications.
- **User Dashboard**: View assigned companies, log communications, and view notifications.
- **Calendar View**: Users can view and interact with a calendar for each company.
- **Notifications**: Users will be notified about upcoming or overdue communications.

## Technologies Used
- **Frontend**: React.js, Material UI, React Router
- **Backend**: Firebase (Firestore, Authentication)
- **Calendar**: FullCalendar
- **Authentication**: Firebase Authentication

## Getting Started

### Prerequisites
To run this project locally, you need to have the following installed:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sureshpilli97/Communication-Tracking-System.git
   cd Communication-Tracking-System

2. **Install dependencies**:

   After navigating to the Communication-Tracking-System directory, run the following command to install the required dependencies:

   ```bash
   npm install

3. **Firebase Configuration**:(If needed)

    Inside your src folder, Change a firebase.js file and add your Firebase credentials if you want to change as shown below:

    const firebaseConfig = {
        apiKey: 'YOUR_API_KEY',
        authDomain: 'YOUR_AUTH_DOMAIN',
        projectId: 'YOUR_PROJECT_ID',
        storageBucket: 'YOUR_STORAGE_BUCKET',
        messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
        appId: 'YOUR_APP_ID',
        measurementId: 'YOUR_MEASUREMENT_ID'
    };



4. **Run the Development Server**   :

    Once you've installed the dependencies and set up Firebase, run the following command to start the development server:
    ```bash
   npm start

## Login Details

### Admin Login:

    Email: admin@gmail.com
    Password: admin321@

    Admins will have access to manage companies and communications, as well as view notifications and calendar details.

### User Login:

    Email: user@gmail.com
    Password: user321@

    Users will be able to view their assigned companies, log communications, and view notifications. They also have access to the calendar view for their respective companies.