import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Chip, Divider, Drawer, useTheme, useMediaQuery, IconButton, LinearProgress } from '@mui/material';
import { Add as AddIcon, AssignmentTurnedIn as TaskIcon, Edit as EditIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import { useUserContext } from '../UserContext';
import { getProgressStatus, calculateAverageProgress, getProgressColor } from '../utils/projectUtils';

const Layout = ({ children, onAddTask }) => {
    const { user, setUser, setProjects, projects, userProjects, selectedCategory, setSelectedCategory, filteredProjects, getPriorityColor, allTasks } = useUserContext();
    const currentUser = user || "Alice";
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Memoize the average progress calculation to prevent recalculation on every render
    const averageProgress = useMemo(() => {
        return calculateAverageProgress(filteredProjects);
    }, [filteredProjects]);

    
    const handleNavigation = useCallback((path) => {
        navigate(path);
        if (!isMdUp) {
            setMobileOpen(false);
        }
    }, [navigate, isMdUp]);

    // Memoize the recent tasks to prevent unnecessary re-renders
    const recentTasks = useMemo(() => {
        console.log('🔄 Memoizing recent tasks', allTasks);
        // Sort by task ID (higher ID = more recent) and get the 2 most recent
        return allTasks
            .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
            .slice(0, 2);
    }, [allTasks]);

    const recentTaskDisplay = useMemo(() => (
        <Box role="list">

            {recentTasks.map((task) => (
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
    ), [recentTasks, handleNavigation, getPriorityColor]);

    // Remove the old useState for recentTaskDisplay
    // const [recentTaskDisplay, setRecentTaskDisplay] = useState(false);

    const drawerWidth = 300;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    // Use the memoized filtered projects directly
    const { totalTasks, activeProjects } = useMemo(() => ({
        totalTasks: allTasks.length,
        activeProjects: filteredProjects.length
    }), [allTasks.length, filteredProjects.length]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        navigate('/'); // Navigate to dashboard on category change
        if (!isMdUp) {
            setMobileOpen(false); // Close mobile drawer on category change
        }
    };

    const drawerContent = (
        <Box sx={{
            height: '100vh', // Use full viewport height
            bgcolor: '#37474f',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Fixed header section */}
            <Box sx={{ 
                p: 2, 
                flexShrink: 0, // Prevent header from shrinking
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
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

                {/* Create New Project Button */}
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
            </Box>

            {/* Scrollable content section */}
            <Box sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', // Enable vertical scrolling
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* Quick Navigation Links */}
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
                            onClick={() => handleNavigation('/all-tasks')}
                        >
                            My Tasks ({totalTasks})
                        </Typography>
                    </Box>
                </Box>

                {/** Statistics Section */}
                <Box
                    sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
                    component="section"
                    aria-label="Task statistics"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <TaskIcon sx={{ mr: 1 }} />
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
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Portfolio Overview
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Overall Progress
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {averageProgress}%
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={averageProgress}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: getProgressColor(averageProgress),
                                        borderRadius: 3
                                    }
                                }}
                            />

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {getProgressStatus(averageProgress)} • {userProjects.length} projects
                            </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                            Average completion across all your projects
                        </Typography>
                    </Box>
                </Box>

                {/* Recent Tasks Section */}
                <Box
                    sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
                    component="section"
                    aria-label="Recent tasks"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <EditIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                            Recent Tasks
                        </Typography>
                    </Box>
                    {recentTaskDisplay}
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
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
                        keepMounted: true, // Better open performance on mobile
                        BackdropProps: {
                            'aria-hidden': false
                        },
                        'aria-hidden': false
                    }}
                    sx={styles.mobileDrawer}
                    PaperProps={{
                        'aria-hidden': false
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={styles.desktopDrawer}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={styles.mainBox}
                aria-hidden={false}
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
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;

// ...existing code...
const styles = {
    mobileDrawer: {
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 300,
            height: '100vh', // Full viewport height
            overflow: 'hidden' // Let content handle its own scrolling
        },
    },
    desktopDrawer: {
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 300,
            position: 'fixed', // Fixed position to stay in place
            top: 0,
            left: 0,
            height: '100vh', // Full viewport height
            border: 'none',
            bgcolor: '#37474f',
            overflow: 'hidden' // Let content handle its own scrolling
        },
    },
    mainBox: {
        flexGrow: 1,
        bgcolor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    }
};

