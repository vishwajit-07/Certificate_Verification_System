CERTIFICATE VERIFICATION SYSTEM
==============================

A full-stack Certificate Verification System built using
Node.js, Express, MongoDB (Backend) and React + Vite (Frontend).


------------------------------------------------------------
PROJECT STRUCTURE
------------------------------------------------------------

certificate_verification_system/

backend/
- controllers/
- models/
- routes/
- package.json
- server.js
- node_modules/   (NOT pushed to GitHub)

frontend/
- src/
- public/
- package.json
- vite.config.js
- node_modules/   (NOT pushed to GitHub)

.gitignore
README.txt


------------------------------------------------------------
IMPORTANT NOTE ABOUT NODE_MODULES
------------------------------------------------------------

The node_modules folder is NOT pushed to GitHub.

This is intentional and follows standard industry practice.

Reason:
- node_modules is very large
- it is OS dependent
- dependencies can be recreated easily

After cloning the project on a new system,
you MUST run "npm install" to generate node_modules.


------------------------------------------------------------
HOW TO CLONE THE PROJECT
------------------------------------------------------------

1. Open terminal / command prompt

2. Run:
   git clone https://github.com/vishwajit-07/Certificate_Verification_System.git

3. Go into the project folder:
   cd certificate_verification_system


------------------------------------------------------------
BACKEND SETUP
------------------------------------------------------------

4. Open terminal and go to backend folder:
   cd backend

5. Install backend dependencies:
   npm install

6. Create a .env file inside backend folder with following content:

   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

   SMTP_USER=yourgmail@gmail.com
   SMTP_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:5173

7. Run backend server:
   npm run dev

Backend will start on:
http://localhost:5000

KEEP THIS TERMINAL RUNNING.


------------------------------------------------------------
FRONTEND SETUP
------------------------------------------------------------

8. Open a NEW terminal / command prompt

9. Go to frontend folder:
   cd frontend

10. Install frontend dependencies:
    npm install

11. Run frontend server:
    npm run dev

Frontend will start on:
http://localhost:5173


------------------------------------------------------------
RUNNING BACKEND AND FRONTEND TOGETHER
------------------------------------------------------------

You must use TWO separate terminals.

Terminal 1 (Backend):
cd backend
npm run dev

Terminal 2 (Frontend):
cd frontend
npm run dev


------------------------------------------------------------
COMMON ERRORS AND SOLUTIONS
------------------------------------------------------------

ERROR: Cannot find module
SOLUTION: Run npm install

ERROR: node_modules folder missing
SOLUTION: Run npm install

ERROR: Forgot password email not working
SOLUTION:
- Check SMTP credentials in .env
- Use Gmail App Password
- Do not use normal Gmail password

ERROR: API not working
SOLUTION:
- Ensure backend is running on port 5000
- Ensure frontend is running on port 5173


------------------------------------------------------------
TECHNOLOGIES USED
------------------------------------------------------------

Frontend:
- React
- Vite
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Authentication:
- JWT
- Cookies

Email:
- Nodemailer (Gmail SMTP)


------------------------------------------------------------
IMPORTANT RULES
------------------------------------------------------------

- Do NOT push node_modules
- Do NOT push .env file
- Always run npm install after cloning
- Use two terminals for backend and frontend


------------------------------------------------------------
AUTHOR
------------------------------------------------------------

Developed by: Vishwajit Mavalankar.


------------------------------------------------------------
LICENSE
------------------------------------------------------------

This project is created for learning and educational purposes only.
