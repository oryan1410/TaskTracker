import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  FolderOpen as ProjectIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AddProject = ({ open, onClose, onSave }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    dueDate: '',
    color: '#1976d2',
    teamMembers: []
  });

  const handleInputChange = (field) => (event) => {
    setProjectData({
      ...projectData,
      [field]: event.target.value
    });
  };

  const handleSave = () => {
    if (projectData.name.trim()) {
      onSave && onSave(projectData);
      // Reset form
      setProjectData({
        name: '',
        description: '',
        dueDate: '',
        color: '#1976d2',
        teamMembers: []
      });
      onClose && onClose();
    }
  };

  const handleCancel = () => {
    // Reset form
    setProjectData({
      name: '',
      description: '',
      dueDate: '',
      color: '#1976d2',
      teamMembers: []
    });
    onClose && onClose();
  };

  // If used as a page (not modal)
  if (!open) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="xxl">
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="#333">
              Add Project
            </Typography>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              <PersonIcon />
            </Avatar>
          </Box>

          <Grid container spacing={3}>
            {/* Left Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, bgcolor: '#37474f', color: 'white', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Dashboard
                </Typography>
                <List>
                  <ListItem button>
                    <ListItemText primary="All Projects" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="My Projects" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Shared Projects" />
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Projects
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Create New Project
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Profile
                </Typography>
                
                <Box sx={{ mt: 3, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                  <ProjectIcon />
                  <Typography variant="caption" display="block">
                    Projects
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <AddProjectForm 
                projectData={projectData}
                onInputChange={handleInputChange}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Modal version
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#37474f', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6">Add Project</Typography>
        <Button onClick={onClose} sx={{ color: 'white', minWidth: 'auto' }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <AddProjectForm 
          projectData={projectData}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isModal={true}
        />
      </DialogContent>
    </Dialog>
  );
};

const AddProjectForm = ({ projectData, onInputChange, onSave, onCancel, isModal = false }) => {
  return (
    <Box sx={{ 
      bgcolor: isModal ? 'white' : '#37474f', 
      color: isModal ? 'inherit' : 'white',
      minHeight: isModal ? '500px' : 'auto',
      p: 3,
      borderRadius: isModal ? 0 : 2
    }}>
      <Grid container spacing={3}>
        {/* Left Section - Form */}
        <Grid item xs={12} md={8}>
          <Box sx={{ bgcolor: isModal ? 'inherit' : 'rgba(255,255,255,0.1)', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: isModal ? 'inherit' : 'white' }}>
              Project Details
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
                Project Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter project name"
                value={projectData.name}
                onChange={onInputChange('name')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isModal ? 'white' : 'rgba(255,255,255,0.9)',
                    '& fieldset': {
                      borderColor: isModal ? '#e0e0e0' : 'transparent',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Project description"
                value={projectData.description}
                onChange={onInputChange('description')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isModal ? 'white' : 'rgba(255,255,255,0.9)',
                    '& fieldset': {
                      borderColor: isModal ? '#e0e0e0' : 'transparent',
                    },
                  },
                }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
                  Due Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={projectData.dueDate}
                  onChange={onInputChange('dueDate')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isModal ? 'white' : 'rgba(255,255,255,0.9)',
                      '& fieldset': {
                        borderColor: isModal ? '#e0e0e0' : 'transparent',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
                  Project Color
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={projectData.color}
                    onChange={onInputChange('color')}
                    sx={{
                      bgcolor: isModal ? 'white' : 'rgba(255,255,255,0.9)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isModal ? '#e0e0e0' : 'transparent',
                      },
                    }}
                  >
                    <MenuItem value="#1976d2">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%' }} />
                        Blue
                      </Box>
                    </MenuItem>
                    <MenuItem value="#4caf50">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '50%' }} />
                        Green
                      </Box>
                    </MenuItem>
                    <MenuItem value="#ff9800">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: '50%' }} />
                        Orange
                      </Box>
                    </MenuItem>
                    <MenuItem value="#f44336">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: '50%' }} />
                        Red
                      </Box>
                    </MenuItem>
                    <MenuItem value="#9c27b0">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#9c27b0', borderRadius: '50%' }} />
                        Purple
                      </Box>
                    </MenuItem>
                    <MenuItem value="#607d8b">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#607d8b', borderRadius: '50%' }} />
                        Blue Grey
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
                Team Members (Optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Add team member emails separated by commas"
                value={projectData.teamMembers.join(', ')}
                onChange={(e) => {
                  const members = e.target.value.split(',').map(email => email.trim()).filter(email => email);
                  onInputChange('teamMembers')({ target: { value: members } });
                }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isModal ? 'white' : 'rgba(255,255,255,0.9)',
                    '& fieldset': {
                      borderColor: isModal ? '#e0e0e0' : 'transparent',
                    },
                  },
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{
                  color: isModal ? 'inherit' : 'white',
                  borderColor: isModal ? '#e0e0e0' : 'white',
                  '&:hover': {
                    borderColor: isModal ? '#1976d2' : 'rgba(255,255,255,0.8)',
                    bgcolor: isModal ? 'rgba(25, 118, 210, 0.04)' : 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onSave}
                disabled={!projectData.name.trim()}
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  }
                }}
              >
                Create Project
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Section - Project Preview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            bgcolor: isModal ? '#f9f9f9' : 'rgba(255,255,255,0.1)', 
            borderRadius: 2,
            height: 'fit-content'
          }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: isModal ? 'inherit' : 'white' }}>
              Project Preview
            </Typography>
            
            <Typography variant="body2" sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)', mb: 2 }}>
              See how your project will look once created
            </Typography>
            
            {projectData.name ? (
              <Box sx={{ 
                p: 2, 
                bgcolor: isModal ? projectData.color : 'rgba(255,255,255,0.2)', 
                borderRadius: 1, 
                mb: 2,
                color: 'white'
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {projectData.name}
                </Typography>
                {projectData.description && (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    {projectData.description.length > 50 
                      ? `${projectData.description.substring(0, 50)}...` 
                      : projectData.description}
                  </Typography>
                )}
                {projectData.dueDate && (
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mt: 1 }}>
                    Due: {new Date(projectData.dueDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ 
                p: 2, 
                bgcolor: isModal ? '#e3f2fd' : 'rgba(255,255,255,0.2)', 
                borderRadius: 1, 
                textAlign: 'center',
                mb: 2
              }}>
                <Typography variant="body2" sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
                  Project preview will appear here
                </Typography>
              </Box>
            )}
            
            <Typography variant="subtitle2" sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)', mb: 1 }}>
              Quick Stats
            </Typography>
            <Typography variant="body2" sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
              Progress: 0%
            </Typography>
            <Typography variant="body2" sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
              Tasks: 0
            </Typography>
            <Typography variant="body2" sx={{ color: isModal ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>
              Team: {projectData.teamMembers.length} members
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddProject;
