import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks = [], onTaskClick, onTaskEdit, onTaskDelete, title = "Tasks" }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter !== 'all' && task.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getTasksByStatus = (status) => {
    return sortedTasks.filter(task => task.status === status);
  };

  return (
    <Box>
      {/* Header with filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="all">All Tasks</MenuItem>
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Task List */}
      {filter === 'all' ? (
        // Show by status columns when showing all
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="error.main">
              To Do ({getTasksByStatus('To Do').length})
            </Typography>
            {getTasksByStatus('To Do').map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="warning.main">
              In Progress ({getTasksByStatus('In Progress').length})
            </Typography>
            {getTasksByStatus('In Progress').map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="success.main">
              Done ({getTasksByStatus('Done').length})
            </Typography>
            {getTasksByStatus('Done').map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))}
          </Grid>
        </Grid>
      ) : (
        // Show filtered list
        <Box>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {sortedTasks.length} task(s) found
          </Typography>
          {sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))}
        </Box>
      )}

      {sortedTasks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first task to get started'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TaskList;