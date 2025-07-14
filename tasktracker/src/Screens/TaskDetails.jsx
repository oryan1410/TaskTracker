import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  AssignmentTurnedIn as TaskIcon,
  CalendarToday as CalendarIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

const TaskDetails = ({ task, onBack }) => {
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [taskColor, setTaskColor] = useState('#1976d2');
  const [editableTask, setEditableTask] = useState(null);
  const [comments] = useState([
    {
      id: 1,
      author: 'Anneria Black',
      content: 'Omni program us fort',
      date: '4/18/2024',
      avatar: 'AB'
    },
    {
      id: 2,
      author: 'Corly Fisher',
      content: 'Thanks I\'ll keep you updated.',
      date: '4/18/2024',
      avatar: 'CF'
    }
  ]);

  const defaultTask = {
    id: 1,
    title: 'Design landing page',
    priority: 'High',
    status: 'To Do',
    dueDate: '4/25/2024',
    assignee: 'JD',
    description: 'Detailed description of the task',
    createdDate: '4/26/2024',
    color: '#1976d2'
  };

  const currentTask = task || defaultTask;

  // Initialize editable task and color when component loads
  React.useEffect(() => {
    setEditableTask(currentTask);
    setTaskColor(currentTask.color || '#1976d2');
  }, [currentTask]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save changes logic here
      console.log('Saving task changes:', editableTask);
    }
  };

  const handleTaskChange = (field, value) => {
    setEditableTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (color) => {
    setTaskColor(color);
    handleTaskChange('color', color);
  };

  const colorOptions = [
    { value: '#1976d2', label: 'Blue' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#f44336', label: 'Red' },
    { value: '#9c27b0', label: 'Purple' },
    { value: '#607d8b', label: 'Blue Grey' },
    { value: '#795548', label: 'Brown' },
    { value: '#009688', label: 'Teal' }
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="#333">
            Task Details
          </Typography>
          <Avatar sx={{ bgcolor: '#1976d2' }}>
            <PersonIcon />
          </Avatar>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content - Full Width */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              {/* Task Header */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editableTask?.title || ''}
                        onChange={(e) => handleTaskChange('title', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                        inputProps={{
                          style: { fontSize: '1.5rem', fontWeight: 'bold' }
                        }}
                      />
                    ) : (
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: taskColor }}>
                        {editableTask?.title || currentTask.title}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    {isEditing ? (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={editableTask?.priority || ''}
                          label="Priority"
                          onChange={(e) => handleTaskChange('priority', e.target.value)}
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={editableTask?.priority || currentTask.priority} 
                        sx={{ 
                          bgcolor: getPriorityColor(editableTask?.priority || currentTask.priority), 
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    )}
                    
                    <IconButton 
                      onClick={handleEditToggle}
                      sx={{ 
                        bgcolor: isEditing ? '#4caf50' : '#1976d2', 
                        color: 'white',
                        '&:hover': {
                          bgcolor: isEditing ? '#388e3c' : '#1565c0'
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Color Picker Section - Only show when editing */}
                {isEditing && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PaletteIcon sx={{ color: '#666' }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        Task Color Theme
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      {colorOptions.map((color) => (
                        <Grid item key={color.value}>
                          <Box
                            onClick={() => handleColorChange(color.value)}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: color.value,
                              borderRadius: 1,
                              cursor: 'pointer',
                              border: taskColor === color.value ? '3px solid #333' : '2px solid transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: 2
                              }
                            }}
                            title={color.label}
                          >
                            {taskColor === color.value && (
                              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                                ✓
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Due date
                    </Typography>
                    {isEditing ? (
                      <TextField
                        type="date"
                        size="small"
                        value={editableTask?.dueDate || ''}
                        onChange={(e) => handleTaskChange('dueDate', e.target.value)}
                        sx={{ mt: 0.5 }}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight="medium">
                        {editableTask?.dueDate || currentTask.dueDate}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {editableTask?.createdDate || currentTask.createdDate}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    {isEditing ? (
                      <FormControl size="small" sx={{ mt: 0.5, minWidth: 100 }}>
                        <Select
                          value={editableTask?.status || ''}
                          onChange={(e) => handleTaskChange('status', e.target.value)}
                        >
                          <MenuItem value="To Do">To Do</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Done">Done</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        label={editableTask?.status || currentTask.status}
                        size="small"
                        sx={{ 
                          mt: 0.5,
                          bgcolor: taskColor,
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editableTask?.description || ''}
                    onChange={(e) => handleTaskChange('description', e.target.value)}
                    variant="outlined"
                    placeholder="Task description..."
                    label="Description"
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {editableTask?.description || currentTask.description}
                  </Typography>
                )}
              </Box>

              {/* Comments Section */}
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Comments
              </Typography>

              <List>
                {comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {comment.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {comment.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comment.date}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {/* Add Comment */}
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </Box>
              </Box>

              {/* Back Button */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Button variant="outlined" onClick={onBack}>
                  Back to Dashboard
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TaskDetails;
