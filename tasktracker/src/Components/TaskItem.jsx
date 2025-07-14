import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button } from '@mui/material';

const TaskItem = ({ 
  task, 
  onStatusChange, 
  onViewDetails,
  getPriorityColor 
}) => {
  return (
    <Card
      sx={{
        mb: 1,
        border: task.status === 'Done' ? '2px solid #4caf50' : '1px solid #e0e0e0',
        bgcolor: task.status === 'Done' ? '#f1f8e9' : 'white'
      }}
    >
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{
              textDecoration: task.status === 'Done' ? 'line-through' : 'none',
              color: task.status === 'Done' ? 'text.secondary' : 'text.primary'
            }}
          >
            {task.title}
          </Typography>
          <Chip
            label={task.priority}
            size="small"
            sx={{
              bgcolor: getPriorityColor(task.priority),
              color: 'white'
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Due: {task.dueDate}
          </Typography>
          <Button
            size="small"
            variant={task.status === 'Done' ? 'outlined' : 'contained'}
            color={task.status === 'Done' ? 'default' : 'success'}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(
                task.id,
                task.status === 'Done' ? 'To Do' : 'Done'
              );
            }}
            sx={{ fontSize: '0.7rem', py: 0.5, px: 1 }}
          >
            {task.status === 'Done' ? 'Undo' : 'Complete'}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Status: {task.status}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(task);
            }}
            aria-label={`View details for task: ${task.title}`}
            sx={{ 
              fontSize: '0.7rem',
              py: 0.5, 
              px: 1,
              color: '#fff',
              backgroundColor: '#1976D2',
              '&:hover': {
                backgroundColor: '#115293',
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
