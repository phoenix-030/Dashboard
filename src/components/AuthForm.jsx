import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,  //previaous valueva store panni vaikum
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.error);
          toast.error(result.error || 'Login failed');
        } else {
          toast.success('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      } else {
        // Validate form
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('All fields are required');
          toast.error('All fields are required');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          toast.error('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          toast.error('Password must be at least 6 characters');
          return;
        }

        
        //signup
        const result = await signUp(formData.name, formData.email, formData.password);
        if (!result.success) {
          setError(result.error);
          toast.error(result.error || 'Sign up failed');
        } else {
          toast.success(result.message || 'Account created successfully! Please login.');
          // Switch to login mode after successful signup
          setIsLogin(true);
          // Clear form except email
          setFormData({
            name: '',
            email: formData.email,
            password: '',
            confirmPassword: ''
          });
        }
      }
    } catch {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {setIsLogin(!isLogin); 
       setError('');    
       setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };




  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light ">
      <div className="card shadow-lg   badge text-bg-white" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-labe text-black bolderl p-2">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Enter your name" />
              </div>
            )}
            
            <div className="mb-3">
              <label className="form-label text-black bolder">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter your email" required />
            </div>
            
            <div className="mb-3">
              <label className="form-label text-black bolder">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter your password" required />
            </div>
            

            
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label text-black bolder ">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" placeholder="Confirm your password" required />
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success w-100"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isLogin ? 'Logging in...' : 'Signing up...'}
                </>
              ) : (
                isLogin ? 'Login' : 'Sign Up'
              )}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <small className="text-muted">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="btn btn-link p-0 text-danger"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
