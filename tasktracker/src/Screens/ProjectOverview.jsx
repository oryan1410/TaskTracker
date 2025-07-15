import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Chip, Avatar, IconButton, Button, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Fab, Tooltip, Alert, Paper, Divider } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon, People as PeopleIcon, Assignment as AssignmentIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useUserContext } from '../UserContext';
import TaskItem from '../Components/TaskItem';
import AddTaskModal from '../Components/AddTaskModal';

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

const ProjectOverview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, updateProject, addPartnerToProject, removePartnerFromProject, changeTaskStatus, setSelectedProject } = useUserContext();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
    const [editedProject, setEditedProject] = useState({});
    const [newPartner, setNewPartner] = useState({ username: '', role: 'Member' });
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskDetailOpen, setTaskDetailOpen] = useState(false);
    const [addTaskOpen, setAddTaskOpen] = useState(false);

    // Find the project
    const project = projects.find(p => p.id === parseInt(id));

    useEffect(() => {
        setSelectedProject(project);
    }, []);

    // Memoized calculations for project statistics
    const projectStats = useMemo(() => {
        if (!project) return null;

        const tasks = project.tasks || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'Done').length;
        const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
        const todoTasks = tasks.filter(task => task.status === 'To Do').length;

        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Priority distribution
        const highPriority = tasks.filter(task => task.priority === 'High').length;
        const mediumPriority = tasks.filter(task => task.priority === 'Medium').length;
        const lowPriority = tasks.filter(task => task.priority === 'Low').length;

        // Overdue tasks
        const currentDate = new Date();
        const overdueTasks = tasks.filter(task =>
            task.status !== 'Done' && new Date(task.due_date) < currentDate
        ).length;

        // Tasks completion over time (last 7 days) based on completed_at
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });
        

const completionData = last7Days.map(date => ({
    date: date.slice(5), // MM-DD format
    completed: tasks.filter(task =>
        task.status === 'Done' && task.completed_at === date
    ).length
}));

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            progressPercentage,
            highPriority,
            mediumPriority,
            lowPriority,
            overdueTasks,
            completionData
        };
    }, [project]);

    if (!project) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Project not found</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        );
    }



        const handleTaskClick = (task) => {
    setSelectedTask(task);
    navigate(`/task/${task.id}`);
    };

    const handleEditProject = () => {
        setEditedProject({ ...project });
        setEditDialogOpen(true);
    };

    const handleSaveProject = () => {
        if (updateProject) {
            updateProject(editedProject);
        }
        setEditDialogOpen(false);
    };

    const handleAddPartner = () => {
        if (newPartner.username.trim() && addPartnerToProject) {
            addPartnerToProject(project.id, {
                id: Date.now(), // In real app, this would come from user database
                username: newPartner.username,
                role: newPartner.role
            });
            setNewPartner({ username: '', role: 'Member' });
            setPartnerDialogOpen(false);
        }
    };

    const handleRemovePartner = (partnerId) => {
        if (removePartnerFromProject) {
            removePartnerFromProject(project.id, partnerId);
        }
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

    // Data for charts
    const statusData = [
        { name: 'Completed', value: projectStats.completedTasks, color: COLORS[0] },
        { name: 'In Progress', value: projectStats.inProgressTasks, color: COLORS[1] },
        { name: 'To Do', value: projectStats.todoTasks, color: COLORS[2] }
    ].filter(item => item.value > 0);

    const priorityData = [
        { name: 'High', value: projectStats.highPriority },
        { name: 'Medium', value: projectStats.mediumPriority },
        { name: 'Low', value: projectStats.lowPriority }
    ].filter(item => item.value > 0);

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    {project.name}
                </Typography>
                <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={handleEditProject}
                >
                    Edit Project
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Project Details Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card >
                        <CardContent style={styles.card}>
                            <Typography variant="h6" gutterBottom>
                                Project Details
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Description
                                </Typography>
                                <Typography variant="body1">
                                    {project.description}
                                </Typography>
                            </Box>
                            <div style={styles.details}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Due Date
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarIcon fontSize="small" />
                                        <Typography variant="body1">
                                            {new Date(project.due_date).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Project Color
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                backgroundColor: project.color,
                                                borderRadius: 1
                                            }}
                                        />
                                        <Typography variant="body1">
                                            {project.color}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Owner
                                    </Typography>
                                    <Typography variant="body1">
                                        {project.owner}
                                    </Typography>
                                </Box>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Progress Overview */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent style={styles.card}>
                            <Typography variant="h6" gutterBottom>
                                Progress Overview
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        Overall Progress
                                    </Typography>
                                    <Typography variant="body2">
                                        {projectStats.progressPercentage}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={projectStats.progressPercentage}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{xs:6, md:3}} >
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <AssignmentIcon color="primary" sx={{ mb: 1 }} />
                                        <Typography variant="h6">{projectStats.totalTasks}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Tasks
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={{xs:6, md:3}}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <CheckCircleIcon color="success" sx={{ mb: 1 }} />
                                        <Typography variant="h6">{projectStats.completedTasks}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Completed
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={{xs:6, md:3}}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <ScheduleIcon color="warning" sx={{ mb: 1 }} />
                                        <Typography variant="h6">{projectStats.overdueTasks}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Overdue
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={{xs:6, md:3}}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <PeopleIcon color="info" sx={{ mb: 1 }} />
                                        <Typography variant="h6">{project.users?.length || 0}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Members
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team Members */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent style={styles.card}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Team Members
                                </Typography>
                                <Button
                                    startIcon={<AddIcon />}
                                    variant="outlined"
                                    onClick={() => setPartnerDialogOpen(true)}
                                >
                                    Add Partner
                                </Button>
                            </Box>
                            <List>
                                {project.users?.map((user, index) => (
                                    <React.Fragment key={user.id}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: project.color }}>
                                                    {user.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.username}
                                                secondary={user.role}
                                            />
                                            <ListItemSecondaryAction>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    color={user.role === 'Owner' ? 'primary' : 'default'}
                                                />
                                                {user.role !== 'Owner' && (
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleRemovePartner(user.id)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < project.users.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Task Status Chart */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent style={styles.chartCards}>
                            <Typography variant="h6" gutterBottom>
                                Task Status Distribution
                            </Typography>
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                    No tasks available
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Priority Distribution */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent style={styles.chartCards}>
                            <Typography variant="h6" gutterBottom>
                                Priority Distribution
                            </Typography>
                            {priorityData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={priorityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                    No tasks available
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Task Completion Timeline */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent style={styles.chartCards}>
                            <Typography variant="h6" gutterBottom>
                                Task Completion Timeline (Last 7 Days)
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={projectStats.completionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Line type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tasks List */}
                <Grid size={{ xs: 12, md: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tasks ({project.tasks?.length || 0})
                            </Typography>
                            {project.tasks?.length > 0 ? (
                                project.tasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onStatusChange={handleTaskStatusChange}
                                        onViewDetails={handleTaskClick}
                                        getPriorityColor={getPriorityColor}
                                    />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                    No tasks available
                                </Typography>
                            )}
                             <Button
                                      variant="contained"
                                      startIcon={<AddIcon />}
                                      onClick={() => setAddTaskOpen(true)}
                                      sx={{ mb: 2 }}
                                    >
                                      Add Task
                                    </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Project Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Name"
                        fullWidth
                        variant="outlined"
                        value={editedProject.name || ''}
                        onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={editedProject.description || ''}
                        onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={editedProject.due_date || ''}
                        onChange={(e) => setEditedProject({ ...editedProject, due_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Project Color"
                        type="color"
                        fullWidth
                        variant="outlined"
                        value={editedProject.color || '#4caf50'}
                        onChange={(e) => setEditedProject({ ...editedProject, color: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveProject} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Add Partner Dialog */}
            <Dialog open={partnerDialogOpen} onClose={() => setPartnerDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        fullWidth
                        variant="outlined"
                        value={newPartner.username}
                        onChange={(e) => setNewPartner({ ...newPartner, username: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Role"
                        select
                        fullWidth
                        variant="outlined"
                        value={newPartner.role}
                        onChange={(e) => setNewPartner({ ...newPartner, role: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="Member">Member</option>
                        <option value="Manager">Manager</option>
                        <option value="Viewer">Viewer</option>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPartnerDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPartner} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Add Task Modal */}
            <AddTaskModal 
                open={addTaskOpen} 
                onClose={() => setAddTaskOpen(false)} 
            />

            
        </Box>
    );
};

export default ProjectOverview;


const styles = {
    card: {
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        minHeight: '260px',
    },
    chartCards: {
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        height: '380px',
    },
    details: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};
