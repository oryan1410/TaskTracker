import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { calculateProjectProgress, getProgressColor, getProgressStatus } from '../utils/projectUtils';
import TaskItem from './TaskItem';

const ProjectDetails = ({ 
  selectedProject,
  projectTasks,
  onAddTask,
  handleTaskStatusChange,
  handleTaskClick,
  getPriorityColor 
}) => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {selectedProject.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedProject.description}
        </Typography>

        {/* Progress Summary */}
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Project Progress: {calculateProjectProgress(selectedProject)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProjectProgress(selectedProject)}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                bgcolor: getProgressColor(calculateProjectProgress(selectedProject)),
                borderRadius: 3
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {getProgressStatus(calculateProjectProgress(selectedProject))} •
            {projectTasks.filter(t => t.status === 'Done').length} of {projectTasks.length} tasks completed
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Tasks ({projectTasks.length})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Progress: {calculateProjectProgress(selectedProject)}%
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {projectTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onViewDetails={handleTaskClick}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddTask}
          sx={{ mb: 2 }}
        >
          Add Task
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
