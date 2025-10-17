import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { todoService } from '../services/todoService';
import TodoForm from '../components/TodoForm';

const UserTodos = ({ currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filters, setFilters] = useState({
    completed: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    if (userId) {
      fetchTodos();
      fetchStats();
    }
  }, [userId, filters]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getUserTodos(userId, filters);
      if (response.data.success) {
        setTodos(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await todoService.getTodoStats(userId);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTodo = async (formData) => {
    const response = await todoService.createTodo(formData);
    if (response.data.success) {
      fetchTodos();
      fetchStats();
    }
  };

  const handleUpdateTodo = async (formData) => {
    const response = await todoService.updateTodo(editingTodo._id, formData);
    if (response.data.success) {
      fetchTodos();
      fetchStats();
      setEditingTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId, todoTitle) => {
    if (window.confirm(`Are you sure you want to delete "${todoTitle}"?`)) {
      try {
        await todoService.deleteTodo(todoId);
        fetchTodos();
        fetchStats();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleToggleTodo = async (todoId, completed) => {
    try {
      await todoService.toggleTodo(todoId);
      fetchTodos();
      fetchStats();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      completed: '',
      priority: '',
      search: ''
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filters.completed && todo.completed.toString() !== filters.completed) return false;
    if (filters.priority && todo.priority !== filters.completed) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !new Date(dueDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              ← Back to Users
            </button>
            <h2 className="card-title" style={{ marginTop: '1rem' }}>
              {currentUser?.avatar} {currentUser?.name}'s Todos
            </h2>
            <p style={{ color: 'var(--gray)', margin: 0 }}>
              📧 {currentUser?.email}
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Add Todo
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-grid">
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
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.completionRate}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Search todos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          
          <select
            value={filters.completed}
            onChange={(e) => handleFilterChange('completed', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="false">⏳ Active</option>
            <option value="true">✅ Completed</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <button 
            onClick={clearFilters}
            className="btn btn-secondary"
          >
            🗑️ Clear Filters
          </button>

          <button 
            onClick={fetchTodos}
            className="btn btn-outline"
            title="Refresh todos"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Todos List */}
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No Todos Found</h3>
            <p>{todos.length === 0 ? "This user doesn't have any todos yet." : "No todos match your filters."}</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              ➕ Create First Todo
            </button>
          </div>
        ) : (
          <div className="todo-list">
            {filteredTodos.map(todo => (
              <div 
                key={todo._id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}
              >
                <div className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo._id, todo.completed)}
                    className="checkbox"
                  />
                </div>
                
                <div className="todo-content">
                  <h4 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                    {todo.tags.length > 0 && (
                      <div className="todo-tags">
                        {todo.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </h4>
                  
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                  
                  <div className="todo-meta">
                    <span className={`priority-badge ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    
                    {todo.dueDate && (
                      <span className={`due-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
                        📅 {formatDate(todo.dueDate)}
                        {isOverdue(todo.dueDate) && <span style={{color: 'var(--danger)', marginLeft: '0.5rem'}}>⏰ Overdue!</span>}
                      </span>
                    )}
                    
                    <span className="created-date">
                      Created: {formatDate(todo.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="todo-actions">
                  <button
                    onClick={() => handleToggleTodo(todo._id, todo.completed)}
                    className={`btn btn-sm ${todo.completed ? 'btn-warning' : 'btn-success'}`}
                    title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed ? '↩️ Undo' : '✅ Complete'}
                  </button>
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="btn btn-warning btn-sm"
                    title="Edit todo"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id, todo.title)}
                    className="btn btn-danger btn-sm"
                    title="Delete todo"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <TodoForm
          onClose={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
          onSave={editingTodo ? handleUpdateTodo : handleCreateTodo}
          initialData={editingTodo}
          isEditing={!!editingTodo}
          userId={userId}
        />
      )}
    </div>
  );
};

export default UserTodos;