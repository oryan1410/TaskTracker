import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Import screens
import Dashboard from './Screens/Dashboard';
import TaskDetails from './Screens/TaskDetails';
import AddTask from './Screens/AddTask';
import Layout from './Components/Layout';
import AllTasks from './Screens/allTasks';
import ProjectOverview from './Screens/ProjectOverview';
import { UserProvider } from './UserContext';
import { useUserContext } from './UserContext';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#37474f',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});



function App() {

  
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { projects, user, filteredProjects } = useUserContext();

  // Current user - in a real app this would come from authentication
  const currentUser = user || "Alice";

  // Legacy tasks array - keeping for compatibility
  const [tasks, setTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);

  // Get tasks from filtered projects based on current category
  const getFilteredTasks = () => {
    if (filteredProjects.length > 0) {
      return filteredProjects.flatMap(project => project.tasks);
    }
    return getAllTasks();
  };

  // Get all tasks from all projects
  const getAllTasks = () => {
    return projects.flatMap(project => project.tasks);
  };

  // Find a task by ID across all projects
  const findTaskById = (taskId) => {
    for (const project of projects) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        return task;
      }
    }
    return null;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    navigate(`/task/${task.id}`);
  };

  const handleAddProject = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  const goBackToDashboard = () => {
    setSelectedTask(null);
    setShowAddTask(false); // Also clear add task state
    // navigate back
    { window.history.back() }

  };

  // TaskDetails wrapper to handle route parameters
  const TaskDetailsWrapper = () => {
    const { id } = useParams();
    const taskId = parseInt(id);
    const task = findTaskById(taskId);
    
    // If task not found, redirect to dashboard
    React.useEffect(() => {
      if (!task) {
        navigate('/');
      }
    }, [task]);
    
    if (!task) {
      return null;
    }

    return (
      <TaskDetails 
        key={task.id}
        task={task} 
        onBack={goBackToDashboard}
        onTaskUpdate={handleTaskUpdate}
      />
    );
  };

  return (
    <div className="App">
      <Layout 
        onAddTask={() => setShowAddTask(true)}
      >
        <Routes>            <Route 
              path="/" 
              element={
                <Dashboard 
                  key="dashboard"
                  tasks={getFilteredTasks()}
                  onTaskClick={handleTaskClick}
                  onAddTask={() => setShowAddTask(true)}
                />
              } 
            />
          <Route 
            path="/task/:id" 
            element={<TaskDetailsWrapper />} 
          />
          <Route 
            path="/project/:id" 
            element={<ProjectOverview />} 
          />
          <Route 
            path="/add-task" 
            element={
              <AddTask 
                open={false}
                onSave={handleAddProject}
                onClose={goBackToDashboard}
              />
            } 
          />
          <Route 
            path="/all-tasks" 
            element={
              <AllTasks 
                tasks={getFilteredTasks()} 
                onTaskClick={handleTaskClick}
                onAddTask={() => setShowAddTask(true)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>

      {/* Add Task Modal - Only show when showAddTask is true */}
      {showAddTask && (
        <AddTask 
          open={showAddTask}
          onSave={handleAddProject}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
}

export default App;
