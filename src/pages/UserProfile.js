import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, todoService } from '../services/todoService';
import UserForm from '../components/UserForm';

const UserProfile = ({ currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTodos, setRecentTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const [userResponse, statsResponse, todosResponse] = await Promise.all([
        userService.getUser(userId),
        todoService.getTodoStats(userId),
        todoService.getUserTodos(userId, { sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      if (userResponse.data.success) {
        setUser(userResponse.data.data);
      }
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
      if (todosResponse.data.success) {
        setRecentTodos(todosResponse.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (formData) => {
    const response = await userService.updateUser(userId, formData);
    if (response.data.success) {
      setUser(prev => ({ ...prev, ...response.data.data }));
      setShowEditForm(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>User Not Found</h3>
          <p>The user you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid grid-2">
        {/* User Info Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">👤 User Profile</h2>
            <div className="user-actions">
              <button 
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                ← Users
              </button>
              <button 
                onClick={() => navigate(`/user/${userId}/todos`)}
                className="btn btn-primary"
              >
                📝 Todos
              </button>
              <button 
                onClick={() => setShowEditForm(true)}
                className="btn btn-warning"
              >
                ✏️ Edit
              </button>
            </div>
          </div>

          <div className="user-profile" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className="user-avatar-large" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {user.avatar}
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>
              {user.name}
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              📧 {user.email}
            </p>

            {user.phone && (
              <p style={{ marginBottom: '1rem' }}>
                <strong>📞 Phone:</strong> {user.phone}
              </p>
            )}

            {user.bio && (
              <div style={{ 
                background: 'var(--gray-light)', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <strong>💬 Bio:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
                  "{user.bio}"
                </p>
              </div>
            )}

            <p style={{ color: 'var(--gray)' }}>
              <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📊 Performance Stats</h2>
          </div>

          {stats ? (
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{stats.totalTodos}</h3>
                  <p>Total Todos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.completedTodos}</h3>
                  <p>Completed</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.pendingTodos}</h3>
                  <p>Pending</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h3>{stats.completionRate}%</h3>
                  <p>Completion Rate</p>
                </div>
              </div>

              {/* Priority Stats */}
              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Priority Distribution</h4>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="priority-badge priority-high" style={{ display: 'block', marginBottom: '0.5rem' }}>
                      🔴 High
                    </div>
                    <strong>{stats.priorityStats?.high || 0}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="priority-badge priority-medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
                      🟡 Medium
                    </div>
                    <strong>{stats.priorityStats?.medium || 0}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="priority-badge priority-low" style={{ display: 'block', marginBottom: '0.5rem' }}>
                      🟢 Low
                    </div>
                    <strong>{stats.priorityStats?.low || 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading stats...</p>
            </div>
          )}
        </div>

        {/* Recent Todos Card */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 className="card-title">🕒 Recent Todos</h2>
            <button 
              onClick={() => navigate(`/user/${userId}/todos`)}
              className="btn btn-primary"
            >
              View All Todos
            </button>
          </div>

          {recentTodos.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">📝</div>
              <h3>No Todos Yet</h3>
              <p>This user hasn't created any todos yet.</p>
              <button 
                onClick={() => navigate(`/user/${userId}/todos`)}
                className="btn btn-primary"
              >
                ➕ Create First Todo
              </button>
            </div>
          ) : (
            <div className="todo-list">
              {recentTodos.map(todo => (
                <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <h4 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                      {todo.title}
                    </h4>
                    <div className="todo-meta">
                      <span className={`priority-badge ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                      <span className={`due-date ${todo.completed ? 'completed' : ''}`}>
                        {todo.completed ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit User Form Modal */}
      {showEditForm && (
        <UserForm
          onClose={() => setShowEditForm(false)}
          onSave={handleUpdateUser}
          initialData={user}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default UserProfile;