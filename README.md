A **full-stack Multi-User Todo Management Application** built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring beautiful UI, advanced filtering, and comprehensive CRUD operations.

**Frontend is in master Branch
Backend is in Main Branch**

✨ Features
Multi-User Support - Separate todo management for multiple users

Full CRUD Operations - Create, Read, Update, Delete for Users & Todos

Advanced Filtering - Filter by status, priority, due dates, and search

Priority Management - High, Medium, Low priority with color coding

Due Date Tracking - Smart due dates with overdue indicators

Tag System - Categorize todos with custom tags

Real-time Statistics - Completion rates and performance metrics

Beautiful UI - Modern, responsive design with gradient themes

User Profiles - Detailed user pages with statistics

🛠️ Tech Stack
Frontend:

React.js 18.2.0

React Router DOM

Axios for API calls

CSS3 with modern features

Backend:

Node.js

Express.js

MongoDB with Mongoose

CORS enabled

Database:

MongoDB Atlas (Cloud)

Mongoose ODM

Advanced indexing

📦 Installation
Prerequisites
Node.js (v14 or higher)

MongoDB (Local or Atlas)

npm or yarn

1. Clone the repository
bash
git clone https://github.com/vineetGray/crudtodo.git
cd crudtodo
2. Backend Setup
bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb://127.0.0.1:27017/todo_multi_user" >> .env

# Start backend
npm run dev

3. **Frontend Setup**
bash
master branch
cd frontend
npm install

# Start frontend
npm start
🚀 Quick Start
Access the application: http://localhost:3000

Create your first user using the "Add New User" button

Add todos for the user by clicking "Todos"

Manage tasks with priority levels, due dates, and tags

📁 Project Structure
text
mern-todo-multi-user/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.js       # Main App component
│   └── package.json
└── README.md
🎯 API Endpoints
Users
GET /api/users - Get all users with statistics

POST /api/users - Create new user

GET /api/users/:id - Get user details

PUT /api/users/:id - Update user

DELETE /api/users/:id - Delete user and todos

Todos
GET /api/todos/user/:userId - Get user's todos

POST /api/todos - Create new todo

PUT /api/todos/:id - Update todo

DELETE /api/todos/:id - Delete todo

PATCH /api/todos/:id/toggle - Toggle completion

🌐 Deployment
Backend (render)
bash
cd backend
render --prod
Frontend (Netlify)
bash
cd frontend
npm run build

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Vineet Kumar

GitHub: @vineetGray

MongoDB documentation

React.js team

