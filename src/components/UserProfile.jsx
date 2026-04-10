import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = ({ initialSection = 'profile' }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    // Load user profile data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      }));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.userId);
      
      if (userIndex !== -1) {
        // Update user profile data
        users[userIndex] = {
          ...users[userIndex],
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          updatedAt: new Date().toISOString()
        };
        
        // Save updated users
        localStorage.setItem('app_users', JSON.stringify(users));
        
        // Update session with new user data
        const updatedSession = {
          ...user,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio
        };
        
        sessionStorage.setItem('app_session', JSON.stringify(updatedSession));
        
        toast.success('Profile updated successfully!');
      } else {
        setError('User not found');
        toast.error('User not found');
      }
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All password fields are required');
      toast.error('All password fields are required');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      toast.error('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.userId);
      
      if (userIndex !== -1) {
        // Verify current password
        if (users[userIndex].password !== formData.currentPassword) {
          setError('Current password is incorrect');
          toast.error('Current password is incorrect');
          setLoading(false);
          return;
        }
        
        // Update password
        users[userIndex] = {
          ...users[userIndex],
          password: formData.newPassword,
          updatedAt: new Date().toISOString()
        };
        
        // Save updated users
        localStorage.setItem('app_users', JSON.stringify(users));
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        toast.success('Password updated successfully!');
      } else {
        setError('User not found');
        toast.error('User not found');
      }
    } catch (error) {
      setError('Failed to update password');
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-lg py-4">
      <div className="row">
        <div className="col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Account Settings</h5>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeSection === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveSection('profile')}
                >
                  Profile Information
                </button>


                {/* security option */}
                <button className={`list-group-item list-group-item-action ${activeSection === 'security' ? 'active' : ''}`} onClick={() => setActiveSection('security')}>
                                        Security
                </button>




              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-9">
          <div className="card shadow-sm">
            <div className="card-body">
              {activeSection === 'profile' && (
                <>
                  <h4 className="card-title mb-4">Profile Information</h4>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleProfileChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          className="form-control"
                          disabled
                          title="Email cannot be changed"
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          className="form-control"
                          placeholder="Enter phone number"
                        />
                      </div>
                  
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleProfileChange}
                        className="form-control"
                        rows="3"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </>
              )}
              
              {activeSection === 'security' && (
                <>
                  <h4 className="card-title mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleProfileChange}
                        className="form-control"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleProfileChange}
                        className="form-control"
                        required
                        minLength="6"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleProfileChange}
                        className="form-control"
                        required
                        minLength="6"
                      />
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
