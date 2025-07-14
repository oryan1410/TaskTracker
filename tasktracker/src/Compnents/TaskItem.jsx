import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const TaskItem = ({ task, onClick, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    onEdit && onEdit(task);
    handleMenuClose();
  };
  
  const handleDelete = () => {
    onDelete && onDelete(task.id);
    handleMenuClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      case 'Completed': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return '#f44336';
      case 'In Progress': return '#ff9800';
      case 'Done': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer', 
        '&:hover': { 
          bgcolor: '#f9f9f9',
          boxShadow: 2 
        },
        borderRadius: 2
      }}
      onClick={() => onClick && onClick(task)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" fontWeight="medium" sx={{ flex: 1 }}>
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={task.priority} 
              size="small" 
              sx={{ 
                bgcolor: getPriorityColor(task.priority), 
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }} 
            />
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={task.status} 
              size="small" 
              variant="outlined"
              sx={{ 
                borderColor: getStatusColor(task.status),
                color: getStatusColor(task.status)
              }} 
            />
            {task.dueDate && (
              <Typography variant="caption" color="text.secondary">
                Due: {task.dueDate}
              </Typography>
            )}
          </Box>
          
          {task.assignee && (
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#1976d2' }}>
              {task.assignee}
            </Avatar>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default TaskItem;