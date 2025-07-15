import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Chip, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Button } from '@mui/material';
import { Person as PersonIcon, FolderOpen as ProjectIcon, Close as CloseIcon } from '@mui/icons-material';
import { useUserContext } from '../UserContext';
import { calculateProjectProgress } from '../utils/projectUtils';
import ProjectCard from '../Components/ProjectCard';
import ProjectDetails from '../Components/ProjectDetails';

const Dashboard = ({ onAddTask, onTaskClick, tasks: propTasks, currentUser }) => {
    // Reset any task selection when Dashboard mounts
    React.useEffect(() => {
        // Clear any potential task selection state when returning to dashboard
        return () => {
            // Cleanup function
        };
    }, []);

    // Use projects from context
    const { projects, setProjects, selectedProject, setSelectedProject, changeTaskStatus, filteredProjects, selectedCategory, updateAllTasks } = useUserContext();
    const [taskDetailOpen, setTaskDetailOpen] = useState(false);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskComments, setTaskComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        assignee: ''
    });

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        if (onTaskClick) {
            onTaskClick(task);
        } else {
            setTaskDetailOpen(true);
        }
    };

    const handleAddTask = () => {
        setAddTaskOpen(true);
    };

    const handleSaveTask = () => {
        if (!newTask.title.trim() || !selectedProject) return;

        const newTaskData = {
            id: Date.now(), // Use timestamp instead of fixed ID
            title: newTask.title,
            description: newTask.description,
            status: "To Do",
            priority: newTask.priority,
            due_date: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0],
            assignee: newTask.assignee.charAt(0).toUpperCase() || "U",
            assigneeData: { id: 999, username: newTask.assignee || "Unassigned" },
            tags: [],
            comments: []
        };

        // Close dialog first to prevent focus issues
        setAddTaskOpen(false);

                        updateAllTasks(newTaskData);

        // Use setTimeout to allow dialog to close before updating state
        setTimeout(() => {
            setProjects(prevProjects => {
                const updatedProjects = prevProjects.map(project =>
                    project.id === selectedProject.id
                        ? { ...project, tasks: [...project.tasks, newTaskData] }
                        : project
                );

                // Update selected project with the new task
                const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
                setSelectedProject(updatedSelectedProject);

                return updatedProjects;
            });

            // Reset form after state update
            setNewTask({ title: '', description: '', priority: 'Medium', assignee: '', dueDate: '' });
        }, 100); // Short delay to allow dialog animation to complete
    };

    const handleTaskStatusChange = (taskId, newStatus) => {
        changeTaskStatus(taskId, newStatus);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#f44336';
            case 'Medium': return '#ff9800';
            case 'Low': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const renderProjectDetails = () => {
        if (!selectedProject) return null;
        let selectedDetails=  <ProjectDetails
                                selectedProject={selectedProject}
                                projectTasks={projectTasks}
                                onAddTask={handleAddTask}
                                handleTaskStatusChange={handleTaskStatusChange}
                                handleTaskClick={handleTaskClick}
                                getPriorityColor={getPriorityColor}
                            />;
        setSelectedDetails(selectedDetails);
       
    };

    useEffect(() => {
        console.log("Rendering project details for:", selectedProject);
        renderProjectDetails();
    }, [selectedProject, projects]);

    // Use the memoized filtered projects directly from context
    const projectTasks = selectedProject ? selectedProject.tasks : [];

    // Debug function to show progress calculation
    const debugProgress = (project) => {
        const totalTasks = project.tasks?.length || 0;
        const completedTasks = project.tasks?.filter(task => task.status === 'Done').length || 0;
        const progress = calculateProjectProgress(project);
        return progress;
    };

    return (
        <Box>
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 3, maxWidth: '100%' }}>
                <Grid container spacing={3} role="region" aria-labelledby="dashboard-title">
                    {/* Main Content - Full width since sidebar is now in Layout */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography
                                variant="h5"
                                component="h2"
                                id="projects-section"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Projects
                            </Typography>
                            <Chip
                                label={selectedCategory === 'Owned' ? 'My Projects' :
                                    selectedCategory === 'Shared' ? 'Shared Projects' : 'All Projects'}
                                size="small"
                                sx={{
                                    bgcolor: '#1976d2',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Box
                            component="section"
                            aria-label="Projects overview"
                            role="region"
                        >
                            {/* Projects Section */}
                            <Box sx={{ mb: 3 }}>
                                <Box
                                    role="list"
                                    aria-labelledby="projects-section"
                                    aria-describedby="projects-description"
                                >
                                    <span id="projects-description" className="sr-only">
                                        List of active projects with progress indicators
                                    </span>
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                selectedProject={selectedProject}
                                                onProjectSelect={handleProjectSelect}
                                                debugProgress={debugProgress}
                                            />
                                        ))
                                    ) : (
                                        <Paper
                                            sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}
                                        >
                                            <ProjectIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                No Projects Found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                No projects match the current filter.
                                            </Typography>
                                        </Paper>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Sidebar - Selected Project Details */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        { selectedDetails? selectedDetails : (
                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
                                <ProjectIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Select a Project
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Choose a project from the list to view its details and tasks.
                                </Typography>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Task Details Modal */}
            <Dialog
                open={taskDetailOpen}
                onClose={() => setTaskDetailOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {selectedTask?.title}
                    </Typography>
                    <IconButton onClick={() => setTaskDetailOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {selectedTask?.description || 'No description provided'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip label={selectedTask?.priority} />
                        <Chip label={selectedTask?.status} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTaskDetailOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Add Task Modal */}
            <Dialog
                open={addTaskOpen}
                onClose={() => {
                    // Clear any pending focus before closing
                    setAddTaskOpen(false);
                    setNewTask({ title: '', description: '', priority: 'Medium', assignee: '', dueDate: '' });
                }}
                maxWidth="sm"
                fullWidth
                // Add these props to handle focus properly
                aria-labelledby="add-task-dialog-title"
                disableRestoreFocus={true} // Prevent focus restoration issues
            >
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={newTask.priority}
                            label="Priority"
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Assignee"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    />
                    <TextField
                        type="date"
                        size="small"
                        value={newTask.dueDate || ''}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        sx={{ mt: 0.5 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddTaskOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveTask} variant="contained">Add Task</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
