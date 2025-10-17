// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const UserList = ({ onUserSelect }) => {
//   const [users, setUsers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/users');
//       setUsers(response.data.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const createUser = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/users', formData);
//       setShowForm(false);
//       setFormData({ name: '', email: '', phone: '' });
//       fetchUsers();
//     } catch (error) {
//       console.error('Error creating user:', error);
//     }
//   };

//   const deleteUser = async (userId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/users/${userId}`);
//       fetchUsers();
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   const viewTodos = (user) => {
//     onUserSelect(user);
//     navigate(`/user/${user._id}`);
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <h2>Users</h2>
//         <button className="btn btn-primary" onClick={() => setShowForm(true)}>
//           Add User
//         </button>

//         {showForm && (
//           <form onSubmit={createUser} style={{ marginTop: '1rem' }}>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 className="form-control"
//               />
//             </div>
//             <button type="submit" className="btn btn-primary">Create</button>
//             <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
//           </form>
//         )}

//         <div className="user-list">
//           {users.map(user => (
//             <div key={user._id} className="card">
//               <h3>{user.name}</h3>
//               <p>Email: {user.email}</p>
//               {user.phone && <p>Phone: {user.phone}</p>}
//               <div>
//                 <button className="btn btn-primary" onClick={() => viewTodos(user)}>
//                   View Todos
//                 </button>
//                 <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserList;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/todoService';
import UserForm from '../components/UserForm';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      setError('Failed to load users. Please check if the server is running.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    const response = await userService.createUser(formData);
    if (response.data.success) {
      setSuccess('🎉 User created successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleUpdateUser = async (formData) => {
    const response = await userService.updateUser(editingUser._id, formData);
    if (response.data.success) {
      setSuccess('✅ User updated successfully!');
      fetchUsers();
      setEditingUser(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"? This will also delete all their todos!`)) {
      try {
        await userService.deleteUser(userId);
        setSuccess('🗑️ User deleted successfully!');
        fetchUsers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleViewTodos = (user) => {
    onUserSelect(user);
    navigate(`/user/${user._id}/todos`);
  };

  const handleViewProfile = (user) => {
    onUserSelect(user);
    navigate(`/user/${user._id}/profile`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            👥 User Management
          </h2>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Add New User
          </button>
        </div>

        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}

        {success && (
          <div className="message message-success">
            {success}
          </div>
        )}

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{users.reduce((acc, user) => acc + (user.stats?.totalTodos || 0), 0)}</h3>
              <p>Total Todos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{users.reduce((acc, user) => acc + (user.stats?.completedTodos || 0), 0)}</h3>
              <p>Completed Todos</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Users Found</h3>
            <p>Get started by creating your first user!</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              ➕ Create First User
            </button>
          </div>
        ) : (
          <div className="user-list">
            {users.map(user => (
              <div key={user._id} className="user-card fade-in">
                <div className="d-flex align-center">
                  <div className="user-avatar-large">{user.avatar}</div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">📧 {user.email}</p>
                    {user.phone && <p className="user-phone">📞 {user.phone}</p>}
                    {user.bio && <p className="user-bio">💬 {user.bio}</p>}
                    
                    <div className="user-stats">
                      <span className="stat-badge">
                        📝 {user.stats?.totalTodos || 0} Todos
                      </span>
                      <span className="stat-badge">
                        ✅ {user.stats?.completedTodos || 0} Done
                      </span>
                      <span className="stat-badge">
                        ⏳ {user.stats?.pendingTodos || 0} Pending
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-actions">
                  <button 
                    onClick={() => handleViewProfile(user)}
                    className="btn btn-outline btn-sm"
                    title="View Profile"
                  >
                    👤 Profile
                  </button>
                  <button 
                    onClick={() => handleViewTodos(user)}
                    className="btn btn-primary btn-sm"
                    title="Manage Todos"
                  >
                    📝 Todos
                  </button>
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="btn btn-warning btn-sm"
                    title="Edit User"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="btn btn-danger btn-sm"
                    title="Delete User"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onSave={editingUser ? handleUpdateUser : handleCreateUser}
          initialData={editingUser}
          isEditing={!!editingUser}
        />
      )}
    </div>
  );
};

export default UserList;