import React, { useState } from 'react';
import {Box,Card,CardContent,TextField,Button,Typography,Container,IconButton,InputAdornment,Link,Divider,Chip, Avatar} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Task as TaskIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase_setup/firebase';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Login attempt:', formData);
      // Call the onLogin prop to handle authentication
      if (onLogin) {
        onLogin(formData);
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // For demo purposes, simulate successful login
    if (onLogin) {
      onLogin({ email: 'demo@tasktracker.com', password: 'demo123', provider: 'Google' });
    }
  };

  const handleGitHubLogin = () => {
    console.log('GitHub login clicked');
    // For demo purposes, simulate successful login
    if (onLogin) {
      onLogin({ email: 'demo@tasktracker.com', provider: 'GitHub', password: 'demo123' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNewUserChange = (field) => (event) => {
    setNewUserData({
      ...newUserData,
      [field]: event.target.value
    });
  };

  const handleNewUserSubmit = async (event) => {
    event.preventDefault();    
    // Validate new user data
    if (!newUserData.email || !newUserData.password) {
      alert('Please fill in both email and password');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (newUserData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    // Store the user data before clearing the form
    const userDataToCreate = { ...newUserData };
    
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, userDataToCreate.email, userDataToCreate.password);      
      // Close the dialog and clear form after successful creation
      setNewUserOpen(false);
      setNewUserData({ email: '', password: '' });
      
      // Call onLogin to authenticate the new user
      if (onLogin) {
        onLogin({
          email: userDataToCreate.email,
          password: userDataToCreate.password,
          isNewUser: true
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: '#37474f',
              color: 'white',
              p: 4,
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#1976d2',
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 2
              }}
            >
              <TaskIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              TaskTracker
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Welcome back! Please sign in to your account
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Social Login Buttons */}
            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderColor: '#db4437',
                  color: '#db4437',
                  '&:hover': {
                    borderColor: '#db4437',
                    bgcolor: 'rgba(219, 68, 55, 0.04)'
                  }
                }}
              >
                Continue with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={handleGitHubLogin}
                sx={{
                  py: 1.5,
                  borderColor: '#333',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#333',
                    bgcolor: 'rgba(51, 51, 51, 0.04)'
                  }
                }}
              >
                Continue with GitHub
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="OR" size="small" />
            </Divider>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Link
                  href="#"
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Forgot password clicked');
                    // TODO: Add forgot password logic
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  bgcolor: '#1976d2',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#1565c0'
                  }
                }}
                
              >
                Sign In
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="#"
                  sx={{ 
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    color: '#1976d2'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setNewUserOpen(true);
                    
                    console.log('Sign up clicked');
                    // TODO: Add navigation to sign up page
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card
          sx={{
            mt: 3,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#37474f' }}>
              Demo Credentials
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Email:</strong> demo@tasktracker.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Password:</strong> demo123
            </Typography>
          </CardContent>
        </Card>
      </Container>

        {/* New User Dialog */} 
        <Dialog open={newUserOpen} onClose={() => setNewUserOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleNewUserSubmit}>
                <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={newUserData.email}
                    onChange={handleNewUserChange('email')}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={newUserData.password}
                    onChange={handleNewUserChange('password')}
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Create Account
                </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setNewUserOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default Login;
