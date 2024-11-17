# Portfolio Platform

## 📈 Overview

**Portfolio Platform** is a comprehensive web application designed to help users manage their investment portfolios, analyze market trends, stay updated with the latest news, and create custom data visualizations. Built with a robust backend and a responsive, user-friendly frontend, the platform caters to both individual investors and financial analysts.

## 📚 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Design Rationale](#design-rationale)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Run the Application](#run-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Portfolio Management](#portfolio-management)
  - [Market Trends](#market-trends)
  - [Visualizations](#visualizations)
  - [News](#news)
  - [Stocks](#stocks)
- [Two-Factor Authentication (2FA) Setup](#two-factor-authentication-2fa-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## 🌟 Features

- **User Authentication & Authorization**
  - Secure login and registration with role-based access control (`user`, `editor`, `admin`).
- **Portfolio Management**
  - Create, view, edit, and delete portfolio items.
  - Image carousel support for portfolio items.
- **Market Trends Analysis**
  - Visualize stock market trends using dynamic charts.
- **Custom Visualizations**
  - Create and manage custom data visualizations with various chart types (`line`, `bar`, `pie`, `doughnut`).
- **News Integration**
  - Stay updated with the latest financial news.
- **Stock Information**
  - Fetch and display real-time stock data.
- **Responsive Design**
  - Mobile-friendly interface powered by Bootstrap.
- **Two-Factor Authentication (2FA)**
  - Enhanced security with optional 2FA using TOTP.

## 💻 Technology Stack

- **Backend:**
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
  - [Passport.js](http://www.passportjs.org/) for authentication
  - [Helmet](https://helmetjs.github.io/) for security
  - [Speakeasy](https://github.com/speakeasyjs/speakeasy) for 2FA
- **Frontend:**
  - [EJS](https://ejs.co/) Templating Engine
  - [Bootstrap](https://getbootstrap.com/) for responsive design
  - [Chart.js](https://www.chartjs.org/) for data visualizations
  - [Font Awesome](https://fontawesome.com/) for icons
- **Utilities:**
  - [Dotenv](https://github.com/motdotla/dotenv) for environment variables
  - [Nodemon](https://nodemon.io/) for development

## 🎨 Design Rationale

- **EJS Templating:** Chosen for its simplicity and seamless integration with Express.js, allowing dynamic content rendering on the server side.
- **Bootstrap via npm:** Ensures better integration, easier maintenance, and eliminates dependency on external CDNs, enhancing security and performance.
- **Chart.js:** Selected for its ease of use and versatility in creating interactive and responsive charts.
- **Role-Based Access Control:** Implemented to manage user permissions effectively, ensuring that only authorized users can perform certain actions.
- **2FA with Speakeasy:** Adds an extra layer of security, protecting user accounts from unauthorized access.

## 🚀 Installation

### 🛠️ Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local installation or a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 📥 Clone the Repository


git clone https://github.com/yourusername/portfolio-platform.git
cd portfolio-platform

📦 Install Dependencies
Install all necessary packages using npm:
**npm install**

🛑 Environment Variables
Create a .env file in the root directory and add the following variables:
**PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolio-platform
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret**
PORT: The port on which the server will run.
MONGODB_URI: MongoDB connection string. Replace with your MongoDB URI if using a cloud service.
SESSION_SECRET: A secret key for session management.
JWT_SECRET: A secret key for JWT (if applicable).
🗄️ Database Setup
**Ensure MongoDB is running. If using a local installation, start the MongoDB server:**

▶️ Run the Application
Start the server using npm:

**npm start**

📑 API Documentation
🔐 Authentication
POST /login
Description: Authenticate a user and start a session.
Parameters:
   username (string, required)
   password (string, required)
Response:
   Redirects to /dashboard on success.
   Returns error messages on failure.
POST /register
Description: Register a new user.
Parameters:
   username (string, required)
   email (string, required)
   password (string, required)
   firstName (string, optional)
   lastName (string, optional)
   age (number, optional)
   gender (string, optional)
Response:
   Redirects to /login on success.
   Returns error messages on failure.
DELETE /logout
Description: Log out the current user and destroy the session.
Response:
Redirects to / (Home) on success.
👥 User Management
GET /admin/users
Description: View all registered users. Accessible only by admin role.
Response:
Renders a page listing all users.
PUT /admin/users/:id/role
Description: Update a user's role. Accessible only by admin role.
Parameters:
id (string, user ID, required)
role (string, new role, required: user, editor, admin)
Response:
Redirects to /admin/users with a success message.
📈 Portfolio Management
GET /portfolio
Description: View all portfolio items for the logged-in user.
Response:
Renders a page displaying portfolio items.
GET /portfolio/create
Description: Render the form to create a new portfolio item. Accessible by editor and admin roles.
Response:
Renders a form for creating a portfolio item.
POST /portfolio/create
Description: Create a new portfolio item. Accessible by editor and admin roles.
Parameters:
title (string, required)
description (string, required)
images (array of image URLs, optional)
Response:
Redirects to /portfolio with a success message.
GET /portfolio/:id
Description: View a specific portfolio item.
Parameters:
id (string, portfolio item ID, required)
Response:
Renders a page displaying the portfolio item details.
GET /portfolio/:id/edit
Description: Render the form to edit a portfolio item. Accessible only by admin role.
Parameters:
id (string, portfolio item ID, required)
Response:
Renders a form pre-filled with the portfolio item's data.
PUT /portfolio/:id
Description: Update a portfolio item. Accessible only by admin role.
Parameters:
id (string, portfolio item ID, required)
title (string, optional)
description (string, optional)
images (array of image URLs, optional)
Response:
Redirects to /portfolio/:id with a success message.
DELETE /portfolio/:id/delete
Description: Delete a portfolio item. Accessible only by admin role.
Parameters:
id (string, portfolio item ID, required)
Response:
Redirects to /portfolio with a success message.
📊 Market Trends
GET /market-trends
Description: View stock market trends with dynamic charts.
Response:
Renders a page displaying stock market trends visualizations.
POST /market-trends
Description: Fetch and display market trend data based on user input.
Parameters:
symbol (string, stock symbol, required)
Response:
Renders the marketTrends.ejs with fetched data.
📈 Visualizations
GET /visualization/create
Description: Render the form to create a custom visualization. Accessible by editor and admin roles.
Response:
Renders a form for creating a visualization.
POST /visualization/create
Description: Create a custom visualization. Accessible by editor and admin roles.
Parameters:
symbol (string, stock symbol, required)
chartType (string, required: line, bar, pie, doughnut)
Response:
Redirects to the visualization display page with the created chart.
GET /visualization/:id
Description: View a specific custom visualization.
Parameters:
id (string, visualization ID, required)
Response:
Renders a page displaying the custom visualization.
📰 News
GET /news
Description: View the latest financial news.
Response:
Renders a page displaying news articles.
📈 Stocks
GET /stocks
Description: Fetch and view real-time stock information.
Response:
Renders a page with a form to input a stock symbol and displays the stock data upon submission.
POST /stocks
Description: Fetch stock data based on the provided symbol.
Parameters:
symbol (string, required)
Response:
Renders the stocks.ejs page with fetched stock data.
🔒 Two-Factor Authentication (2FA) Setup
Enhancing security, the Portfolio Platform supports Two-Factor Authentication (2FA) using Time-Based One-Time Passwords (TOTP). Here's how to set it up:

🛠️ Prerequisites
Users should have a TOTP-compatible authenticator app installed on their mobile devices, such as:
Google Authenticator
Authy
Microsoft Authenticator
🗝️ Setup Steps
Enable 2FA in User Settings:

Navigate to your account settings/dashboard.
Locate the Two-Factor Authentication section.
Click on Enable 2FA.
Generate a Secret Key:

The application generates a unique secret key for your account.
A QR code representing the secret key is displayed.
Scan the QR Code:

Open your authenticator app.
Use the app to scan the displayed QR code.
The app will automatically add the Portfolio Platform account with the corresponding secret.
Verify the Setup:

Enter the 6-digit code generated by your authenticator app into the application to verify and complete the setup.
Backup Codes (Optional but Recommended):

The application provides backup codes for account recovery.
Important: Store these codes securely (e.g., in a password manager) in case you lose access to your authenticator app.
🛠️ Implementation Details
Backend:
Utilizes Speakeasy for generating and verifying TOTP codes.
Stores the user's 2FA secret in the database, ensuring it's encrypted for security.
Frontend:
Provides a user-friendly interface to enable, disable, and verify 2FA.
Displays QR codes using libraries like qrcode for easy scanning.
🔐 Security Considerations
Encryption: 2FA secrets are encrypted before storage to prevent unauthorized access.
Rate Limiting: Implement rate limiting on 2FA verification attempts to mitigate brute-force attacks.
Secure Transmission: Ensure all data transmissions, especially during 2FA setup and verification, occur over HTTPS.
🚨 Troubleshooting
Cannot Scan QR Code:
Ensure your authenticator app is up to date.
Try zooming in or adjusting the screen resolution.
Lost Access to Authenticator App:
Use backup codes provided during 2FA setup to regain access.
Contact the administrator to reset 2FA for your account.
📖 Usage
Register an Account:

Navigate to the Registration Page.
Fill in the required details and submit the form.
Login:

Go to the Login Page.
Enter your credentials and log in.
If 2FA is enabled, enter the code from your authenticator app.
Manage Portfolio:

Access your portfolio via the dashboard.
Add, edit, or delete portfolio items as per your role permissions.
Analyze Market Trends:

Visit the Market Trends page to view dynamic stock charts.
Create Visualizations:

Navigate to Create Visualization to generate custom charts.
Stay Updated with News:

Check the News section for the latest financial news.
View Stock Information:

Use the Stocks page to fetch real-time stock data.
🤝 Contributing
Contributions are welcome! Follow these steps to contribute to the project:

Fork the Repository:

Click the Fork button at the top-right corner of this page.

Clone Your Fork:

bash
Копировать код
git clone https://github.com/yourusername/portfolio-platform.git
cd portfolio-platform
Create a New Branch:

bash
Копировать код
git checkout -b feature/YourFeatureName
Make Changes and Commit:

bash
Копировать код
git add .
git commit -m "Add Your Feature"
Push to Your Fork:

bash
Копировать код
git push origin feature/YourFeatureName
Create a Pull Request:

Navigate to the original repository and create a pull request from your fork.

📝 Guidelines
Follow the existing code style and structure.
Ensure all new features are properly tested.
Update the README.md if your feature requires changes to the documentation.
📄 License
This project is licensed under the MIT License.

🎓 Acknowledgments
Express.js - Fast, unopinionated, minimalist web framework for Node.js
EJS - Embedded JavaScript templating
Bootstrap - Powerful front-end framework for faster and easier web development
Chart.js - Simple yet flexible JavaScript charting for designers & developers
Passport.js - Simple, unobtrusive authentication for Node.js
Speakeasy - RFC 6238 and RFC 4226 TOTP and HOTP for Node.js
Font Awesome - The web's most popular icon set and toolkit
