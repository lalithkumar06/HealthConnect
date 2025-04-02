# HealthConnect

## 📌 Overview
HealthConnect is a **MERN stack** website designed to connect students with the **Health Center**. It digitalizes **appointments, medicines,** and other services, reducing unnecessary visits for minor tasks.

## 🚀 Features
- Online appointment booking
- Medicine management
- Virtual consultation
-previous visits


## 📂 Folder Structure
```
HealthConnect/
│── Backend/                # Backend (Node.js + Express)
│   │── Controllers/        # Handles request logic
│   │── Middleware/         # Middleware functions
│   │── Models/             # Database models (MongoDB schemas)
│   │── Routers/            # API Routes
│   │── node_modules/       # Backend dependencies
│   │── .env                # Environment variables
│   │── index.js            # Server entry point
│   │── package.json        # Backend dependencies
│   │── package-lock.json   # Backend dependency lock file
│
│── Frontend/               # Frontend (React)
│   │── node_modules/       # Frontend dependencies
│   │── public/             # Static assets
│   │── src/                # React source files
│   │   │── assets/         # Images & static files
│   │   │── Components/     # Reusable UI components
│   │   │── pages/          # Different pages (routes)
│   │   │── styles/         # CSS & styling
│   │   │── api.js          # API calls
│   │   │── App.css         # Main component styling
│   │   │── App.jsx        # App entry point
│   │   │── index.css      # Global styles
│   │   │── main.jsx       # React root render file
│   │   │── protectedRoute.jsx  # Protected route logic
│   │   │── utils.jsx      # Utility functions
│   │── .gitignore         # Ignored files in Git
│   │── eslint.config.js   # ESLint configuration
│   │── index.html         # HTML template
│   │── package.json       # Frontend dependencies
│   │── package-lock.json  # Frontend dependency lock file

```

## 🛠️ Installation
Follow these steps to set up the project locally:

```sh
git clone https://github.com/beast-codez/HealthConnect.git
cd Frontend
npm install
cd ../Backend
npm install
```

## ▶️ Usage
To run the project, use the following command:

first run the frontend and then run the backend in another terminal
```sh
cd Frontend
npm run dev


cd Backend
nodemon index.js

```

## 🤝 Contribution
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Added feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request


---
Made with ❤️ by Vedium Lalith Kumar Reddy 
