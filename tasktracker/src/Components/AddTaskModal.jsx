import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Button } from '@mui/material';
import { useUserContext } from '../UserContext';

export default function AddTaskModal({ open, onClose }) {


        // Use projects from context
        const { setProjects, selectedProject, setSelectedProject, updateAllTasks } = useUserContext();
        const [newTask, setNewTask] = useState({
            title: '',
            description: '',
            priority: 'Medium',
            assignee: ''
        });


    
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
            onClose();
    
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
    

    

    return (
        <>
            {/* Add Task Modal */}
            <Dialog
                open={open}
                onClose={() => {
                    // Clear any pending focus before closing
                    onClose();
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
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSaveTask} variant="contained">Add Task</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}