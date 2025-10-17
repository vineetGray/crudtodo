import React, { useState, useEffect } from 'react';

const TodoForm = ({ onClose, onSave, initialData, isEditing = false, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
    completed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        completed: initialData.completed || false
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        user: userId
      };

      await onSave(processedData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? '✏️ Edit Todo' : '📝 Create New Todo'}
          </h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {error && (
          <div className="message message-error">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              📝 Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              📄 Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Add more details about this task..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                🚦 Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-control"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                📅 Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              🏷️ Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-control"
              placeholder="work, urgent, personal (separate with commas)"
            />
          </div>

          {isEditing && (
            <div className="form-group">
              <label className="form-label d-flex align-center" style={{ gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px' }}
                />
                ✅ Mark as completed
              </label>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderWidth: '2px',
                    display: 'inline-block',
                    marginRight: '0.5rem'
                  }}></div>
                  Saving...
                </>
              ) : isEditing ? (
                '💾 Update Todo'
              ) : (
                '✨ Create Todo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;