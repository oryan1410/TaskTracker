/**
 * Utility functions for project calculations and operations
 */

/**
 * Calculate project progression based on completed tasks
 * @param {Object} project - Project object with tasks array
 * @returns {number} - Progress percentage (0-100)
 */
export const calculateProjectProgress = (project) => {
  if (!project || !project.tasks || project.tasks.length === 0) {
    return 0;
  }
  
  const completedTasks = project.tasks.filter(task => task.status === 'Done').length;
  return Math.round((completedTasks / project.tasks.length) * 100);
};

/**
 * Get task statistics for a project
 * @param {Object} project - Project object with tasks array
 * @returns {Object} - Object containing task counts
 */
export const getProjectTaskStats = (project) => {
  if (!project || !project.tasks) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      toDo: 0
    };
  }
  
  const total = project.tasks.length;
  const completed = project.tasks.filter(task => task.status === 'Done').length;
  const inProgress = project.tasks.filter(task => task.status === 'In Progress').length;
  const toDo = project.tasks.filter(task => task.status === 'To Do').length;
  
  return { total, completed, inProgress, toDo };
};

/**
 * Calculate average progress across multiple projects
 * @param {Array} projects - Array of project objects
 * @returns {number} - Average progress percentage (0-100)
 */
export const calculateAverageProgress = (projects) => {
    console.log('Calculating average progress for projects:', projects);
  if (!projects || projects.length === 0) {
    return 0;
  }
  
  
  const totalProgress = projects.reduce((sum, project) => {
    return sum + calculateProjectProgress(project);
  }, 0);
  
  return Math.round(totalProgress / projects.length);
};

/**
 * Get progress color based on percentage
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} - Color code
 */
export const getProgressColor = (progress) => {
  if (progress >= 80) return '#4caf50'; // Green
  if (progress >= 60) return '#8bc34a'; // Light Green
  if (progress >= 40) return '#ff9800'; // Orange
  if (progress >= 20) return '#ff5722'; // Deep Orange
  return '#f44336'; // Red
};

/**
 * Get progress status text
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} - Status text
 */
export const getProgressStatus = (progress) => {
  if (progress === 100) return 'Completed';
  if (progress >= 80) return 'Near Completion';
  if (progress >= 60) return 'On Track';
  if (progress >= 40) return 'In Progress';
  if (progress >= 20) return 'Getting Started';
  return 'Just Started';
};

/**
 * Sort projects by progress
 * @param {Array} projects - Array of project objects
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted projects array
 */
export const sortProjectsByProgress = (projects, order = 'desc') => {
  return [...projects].sort((a, b) => {
    const progressA = calculateProjectProgress(a);
    const progressB = calculateProjectProgress(b);
    
    return order === 'desc' ? progressB - progressA : progressA - progressB;
  });
};

/**
 * Filter projects by progress range
 * @param {Array} projects - Array of project objects
 * @param {number} minProgress - Minimum progress percentage
 * @param {number} maxProgress - Maximum progress percentage
 * @returns {Array} - Filtered projects array
 */
export const filterProjectsByProgress = (projects, minProgress = 0, maxProgress = 100) => {
  return projects.filter(project => {
    const progress = calculateProjectProgress(project);
    return progress >= minProgress && progress <= maxProgress;
  });
};
