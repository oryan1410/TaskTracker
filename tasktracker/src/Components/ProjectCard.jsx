import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import { calculateProjectProgress, getProgressColor, getProgressStatus } from '../utils/projectUtils';

const ProjectCard = ({ 
  project, 
  selectedProject,
  onProjectSelect,
  debugProgress 
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        cursor: 'pointer',
        border: selectedProject?.id === project.id ? '2px solid #1976d2' : '2px solid transparent',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
      role="listitem"
      tabIndex={0}
      aria-label={`Project: ${project.name}, ${calculateProjectProgress(project)}% complete. Click to select project.`}
      onClick={() => onProjectSelect(project)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            component="h3"
          >
            {project.name}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {debugProgress(project)}%
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              {getProgressStatus(calculateProjectProgress(project))}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {project.description}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={calculateProjectProgress(project)}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              bgcolor: getProgressColor(calculateProjectProgress(project)),
              borderRadius: 4
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
