import React, { useState, useEffect } from 'react';

const UserForm = ({ onClose, onSave, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '👤',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const avatars = ['👤', '👨', '👩', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '🎯', '🌟', '🚀'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        avatar: initialData.avatar || '👤',
        bio: initialData.bio || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatar) => {
    setFormData({
      ...formData,
      avatar
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
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
            {isEditing ? '✏️ Edit User' : '👥 Add New User'}
          </h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {error && (
          <div className="message message-error">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Avatar Selection */}
          <div className="form-group">
            <label className="form-label">Choose Avatar</label>
            <div className="avatar-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {avatars.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  className={`btn-icon ${formData.avatar === avatar ? 'active' : ''}`}
                  style={{
                    fontSize: '1.5rem',
                    padding: '0.5rem',
                    background: formData.avatar === avatar ? 'var(--primary)' : 'var(--gray-light)',
                    color: formData.avatar === avatar ? 'white' : 'inherit'
                  }}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              👤 Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter user's full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter user's email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              📞 Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter user's phone number (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="form-label">
              💬 Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-control"
              placeholder="Tell us about this user..."
              rows="3"
            />
          </div>

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
                '💾 Update User'
              ) : (
                '✨ Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;