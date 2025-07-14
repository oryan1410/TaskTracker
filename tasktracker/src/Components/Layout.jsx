import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Chip, Divider, Drawer, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Add as AddIcon, AssignmentTurnedIn as TaskIcon, Edit as EditIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, onAddTask, projects = [], currentUser = "Alice", onCategoryChange, onFilteredProjectsChange }) => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();
    const location = useLocation();

    const drawerWidth = 300;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (!isMdUp) {
            setMobileOpen(false); // Close mobile drawer after navigation
        }
    };

    // Filter projects based on selected category and current user
    const getFilteredProjects = () => {
        if (!projects || projects.length === 0) return [];
        
        switch (selectedCategory) {
            case 'Owned':
                return projects.filter(project => project.owner === currentUser);
            case 'Shared':
                return projects.filter(project => 
                    project.owner !== currentUser && 
                    project.users.some(user => user.username === currentUser)
                );
            case 'All':
            default:
                return projects.filter(project => 
                    project.owner === currentUser || 
                    project.users.some(user => user.username === currentUser)
                );
        }
    };

    const filteredProjects = getFilteredProjects();
    const allTasks = filteredProjects.flatMap(project => project.tasks);
    const totalTasks = allTasks.length;
    const activeProjects = filteredProjects.length;

    // Notify parent components when category or filtered projects change
    useEffect(() => {
        if (onCategoryChange) {
            onCategoryChange(selectedCategory);
        }
        if (onFilteredProjectsChange) {
            onFilteredProjectsChange(filteredProjects);
        }
    }, [selectedCategory, projects, currentUser]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#f44336';
            case 'Medium': return '#ff9800';
            case 'Low': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const drawerContent = (
        <Box sx={{ height: '100%', bgcolor: '#37474f', color: 'white' }}>
            <Box sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    component="h2"
                    id="navigation-title"
                >
                    TaskTracker
                </Typography>

                {/* Category Filter Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        component="h3"
                        sx={{ mb: 1 }}
                    >
                        Project Categories
                    </Typography>
                    <List sx={{ py: 0 }} dense>
                        {[
                            { label: 'All Projects', value: 'All' },
                            { label: 'My Projects', value: 'Owned' },
                            { label: 'Shared Projects', value: 'Shared' }
                        ].map((category) => (
                            <ListItem
                                key={category.value}
                                button
                                selected={selectedCategory === category.value}
                                sx={{ 
                                    borderRadius: 1, 
                                    mb: 0.5,
                                    py: 0.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                                onClick={() => handleCategoryChange(category.value)}
                            >
                                <ListItemText 
                                    primary={category.label}
                                    sx={{ 
                                        color: 'inherit',
                                        '& .MuiListItemText-primary': {
                                            fontSize: '0.9rem'
                                        }
                                    }}
                                />
                                {selectedCategory === category.value && (
                                    <Chip
                                        label="•"
                                        size="small"
                                        sx={{ 
                                            bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            height: '18px',
                                            width: '18px'
                                        }}
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />

                <List
                    sx={{ py: 0 }}
                    role="menu"
                    aria-labelledby="navigation-title"
                >
                    {[
                        { label: 'Dashboard', path: '/' },
                        { label: 'All Tasks', path: '/tasks' },
                        { label: 'Projects', path: '/projects' }
                    ].map((item) => (
                        <ListItem
                            key={item.label}
                            button
                            selected={location.pathname === item.path}
                            sx={{ 
                                borderRadius: 1, 
                                mb: 1,
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                    }
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                            role="menuitem"
                            aria-current={location.pathname === item.path ? "page" : undefined}
                            tabIndex={0}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemText 
                                primary={item.label}
                                sx={{ color: 'inherit' }}
                            />
                            {location.pathname === item.path && (
                                <Chip
                                    label="•"
                                    size="small"
                                    sx={{ 
                                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                        color: 'white',
                                        fontSize: '0.7rem'
                                    }}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>

                <Button
                    variant="contained"
                    startIcon={<AddIcon aria-hidden="true" />}
                    fullWidth
                    sx={{ mt: 2, bgcolor: '#1976d2', borderRadius: 2 }}
                    onClick={onAddTask}
                    aria-label="Create new project"
                >
                    Create New Project
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<AddIcon aria-hidden="true" />}
                    fullWidth
                    sx={{ 
                        mt: 1, 
                        borderColor: 'rgba(255,255,255,0.3)', 
                        color: 'white',
                        borderRadius: 2,
                        '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            bgcolor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                    onClick={() => handleNavigation('/add-task')}
                    aria-label="Add new task"
                >
                    Add Task
                </Button>

                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} aria-hidden="true" />

                <Box component="nav" aria-label="Quick navigation links">
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        component="h3"
                        id="quick-nav-title"
                    >
                        Quick Navigation
                    </Typography>
                    <Box role="list" aria-labelledby="quick-nav-title">
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            component="button"
                            sx={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                p: 1,
                                borderRadius: 1,
                                '&:hover': { 
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    textDecoration: 'none'
                                },
                                '&:focus': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    outline: '2px solid rgba(255, 255, 255, 0.5)'
                                }
                            }}
                            role="listitem"
                            tabIndex={0}
                            aria-label="Navigate to projects"
                            onClick={() => handleNavigation('/')}
                        >
                            Projects ({activeProjects})
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            component="button"
                            sx={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                p: 1,
                                borderRadius: 1,
                                '&:hover': { 
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    textDecoration: 'none'
                                },
                                '&:focus': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    outline: '2px solid rgba(255, 255, 255, 0.5)'
                                }
                            }}
                            role="listitem"
                            tabIndex={0}
                            aria-label="Navigate to my tasks"
                            onClick={() => handleNavigation('/tasks')}
                        >
                            My Tasks ({totalTasks})
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
                    component="section"
                    aria-label="Task statistics"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <TaskIcon sx={{ mr: 1 }} aria-hidden="true" />
                        <Typography variant="subtitle2" fontWeight="bold">
                            Task Overview
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                            Total Tasks: {totalTasks}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                            Active Projects: {activeProjects}
                        </Typography>
                    </Box>
                </Box>

                {/* Recent Tasks Section */}
                <Box
                    sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
                    component="section"
                    aria-label="Recent tasks"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <EditIcon sx={{ mr: 1 }} aria-hidden="true" />
                        <Typography variant="subtitle2" fontWeight="bold">
                            Recent Tasks
                        </Typography>
                    </Box>
                    <Box role="list" aria-label="Recent tasks">
                        {allTasks.slice(0, 3).map((task) => (
                            <Box
                                key={task.id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }
                                }}
                                role="listitem button"
                                tabIndex={0}
                                aria-label={`Click to view task: ${task.title}`}
                                onClick={() => handleNavigation(`/task/${task.id}`)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight="bold" sx={{ color: 'white' }}>
                                        {task.title}
                                    </Typography>
                                    <Chip
                                        label={task.priority}
                                        size="small"
                                        sx={{
                                            bgcolor: getPriorityColor(task.priority),
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            height: '16px'
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {task.status}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="Main navigation"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
                
                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* App Bar for mobile menu button */}
                <Box
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        p: 2,
                        bgcolor: 'white',
                        boxShadow: 1,
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        TaskTracker
                    </Typography>
                </Box>

                {/* Page Content */}
                <Box sx={{ flexGrow: 1 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
