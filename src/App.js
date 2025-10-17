// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import UserList from './components/UserList';
// import UserTodos from './components/UserTodos';
// import './App.css';

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);

//   return (
//     <Router>
//       <div className="App">
//         <header className="app-header">
//           <h1>📝 Multi-User Todo App</h1>
//         </header>
        
//         <Routes>
//           <Route path="/" element={<UserList onUserSelect={setCurrentUser} />} />
//           <Route path="/user/:userId" element={<UserTodos currentUser={currentUser} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './pages/UserList';
import UserTodos from './pages/UserTodos';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1>Multi User todo app</h1>
            <p>Multi-User Todo Management System</p>
          </div>
          <div className="header-actions">
            {currentUser && (
              <div className="current-user">
                <span className="user-avatar">{currentUser.avatar || '👤'}</span>
                <span className="user-name">{currentUser.name}</span>
              </div>
            )}
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<UserList onUserSelect={setCurrentUser} />} />
            <Route path="/user/:userId/todos" element={<UserTodos currentUser={currentUser} />} />
            <Route path="/user/:userId/profile" element={<UserProfile currentUser={currentUser} />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>vineet @ todo app</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;