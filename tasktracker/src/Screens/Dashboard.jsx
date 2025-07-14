import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, LinearProgress, Button, Avatar, Chip, Grid, List, ListItem, ListItemText, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, AssignmentTurnedIn as TaskIcon, FolderOpen as ProjectIcon, Close as CloseIcon, Comment as CommentIcon, Edit as EditIcon } from '@mui/icons-material';

const Dashboard = ({ onAddTask, onTaskClick, tasks: propTasks, projects: propProjects, selectedCategory, currentUser }) => {
    // Reset any task selection when Dashboard mounts
    React.useEffect(() => {
        // Clear any potential task selection state when returning to dashboard
        return () => {
            // Cleanup function
        };
    }, []);

    // Use projects from props (already filtered by Layout)
    const [projects, setProjects] = useState(propProjects || []);

    // Update projects when props change
    React.useEffect(() => {
        if (propProjects) {
            setProjects(propProjects);
        }
    }, [propProjects]);

    const [selectedProject, setSelectedProject] = useState(null);
    const [taskDetailOpen, setTaskDetailOpen] = useState(false);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskComments, setTaskComments] = useState({});
    const [newComment, setNewComment] = useState('');
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
            id: Date.now(),
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

        setProjects(prevProjects => 
            prevProjects.map(project => 
                project.id === selectedProject.id 
                    ? { ...project, tasks: [...project.tasks, newTaskData] }
                    : project
            )
        );

        // Update selected project to include new task
        setSelectedProject(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTaskData]
        }));

        setNewTask({ title: '', description: '', priority: 'Medium', assignee: '' });
        setAddTaskOpen(false);
    };

    const handleAddComment = () => {
        if (!newComment.trim() || !selectedTask) return;
        
        const comment = {
            id: Date.now(),
            author: "Current User",
            text: newComment,
            timestamp: new Date().toLocaleString()
        };

        setTaskComments(prev => ({
            ...prev,
            [selectedTask.id]: [...(prev[selectedTask.id] || []), comment]
        }));

        setNewComment('');
    };

    const getFilteredProjects = () => {
        // Projects are already filtered by Layout component based on selected category
        return projects;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#f44336';
            case 'Medium': return '#ff9800';
            case 'Low': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do': return '#2196f3';
            case 'In Progress': return '#ff9800';
            case 'Done': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const filteredProjects = getFilteredProjects();
    const projectTasks = selectedProject ? selectedProject.tasks : [];

    return (
        <Box>
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 3, maxWidth: '100%' }}>
                <Grid container spacing={3} role="region" aria-labelledby="dashboard-title">
                    {/* Main Content - Full width since sidebar is now in Layout */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Box
                            component="section"
                            aria-label="Projects overview"
                            role="region"
                        >
                            {/* Projects Section */}
                            <Box sx={{ mb: 3 }}>
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
                                            <Card
                                                key={project.id}
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
                                                aria-label={`Project: ${project.name}, ${project.progress}% complete. Click to select project.`}
                                                onClick={() => handleProjectSelect(project)}
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
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {project.progress}%
                                                        </Typography>
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
                                                        value={project.progress}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: '#e0e0e0',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: project.color,
                                                                borderRadius: 4
                                                            }
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
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
                        {selectedProject ? (
                            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        {selectedProject.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {selectedProject.description}
                                    </Typography>
                                    
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                                            Tasks ({projectTasks.length})
                                        </Typography>
                                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {projectTasks.map((task) => (
                                                <Card
                                                    key={task.id}
                                                    sx={{
                                                        mb: 1,
                                                        cursor: 'pointer',
                                                        '&:hover': { boxShadow: 2 }
                                                    }}
                                                    onClick={() => handleTaskClick(task)}
                                                >
                                                    <CardContent sx={{ py: 1 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2" fontWeight="medium">
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
                                                        <Typography variant="caption" color="text.secondary">
                                                            {task.status} • Due: {task.dueDate}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : (
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
                onClose={() => setAddTaskOpen(false)}
                maxWidth="sm"
                fullWidth
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
