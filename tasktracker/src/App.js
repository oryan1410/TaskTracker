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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  
  // Current user - in a real app this would come from authentication
  const currentUser = "Alice";
  
  // State for filtered projects and selected category from Layout
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Projects data with tasks
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Revamp the company website",
      due_date: "2024-12-15",
      created_at: "2024-07-14",
      progress: 65,
      color: "#4caf50",
      owner: "Alice",
      users: [
        { id: 1, username: "Alice", role: "Owner" },
        { id: 2, username: "Bob", role: "Member" }
      ],
      tasks: [
        {
          id: 1,
          title: "Design new landing page",
          description: "Create a modern design for homepage",
          status: "To Do",
          priority: "High",
          due_date: "2024-10-01",
          dueDate: "2024-10-01",
          assignee: "B",
          assigneeData: { id: 2, username: "Bob" },
          tags: [{ id: 1, name: "Design" }],
          comments: [
            {
              id: 1,
              user: { id: 1, username: "Alice" },
              content: "Make sure to align with branding guidelines",
              created_at: "2024-07-14"
            }
          ]
        },
        {
          id: 2,
          title: "Write SEO content",
          description: "Optimize text for search engines",
          status: "In Progress",
          priority: "Medium",
          due_date: "2024-09-15",
          dueDate: "2024-09-15",
          assignee: "A",
          assigneeData: { id: 1, username: "Alice" },
          tags: [{ id: 2, name: "Content" }],
          comments: []
        },
        {
          id: 3,
          title: "Test mobile responsiveness",
          description: "Ensure website works on all devices",
          status: "Done",
          priority: "High",
          due_date: "2024-08-30",
          dueDate: "2024-08-30",
          assignee: "B",
          assigneeData: { id: 2, username: "Bob" },
          tags: [{ id: 3, name: "Testing" }],
          comments: []
        }
      ]
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Build iOS and Android apps",
      due_date: "2024-11-30",
      created_at: "2024-06-01",
      progress: 30,
      color: "#2196f3",
      owner: "Charlie",
      users: [
        { id: 3, username: "Charlie", role: "Owner" },
        { id: 1, username: "Alice", role: "Member" }
      ],
      tasks: [
        {
          id: 4,
          title: "Setup development environment",
          description: "Configure React Native project",
          status: "Done",
          priority: "High",
          due_date: "2024-07-01",
          dueDate: "2024-07-01",
          assignee: "C",
          assigneeData: { id: 3, username: "Charlie" },
          tags: [{ id: 4, name: "Setup" }],
          comments: []
        },
        {
          id: 5,
          title: "Design app wireframes",
          description: "Create UI/UX mockups",
          status: "To Do",
          priority: "Medium",
          due_date: "2024-09-01",
          dueDate: "2024-09-01",
          assignee: "A",
          assigneeData: { id: 1, username: "Alice" },
          tags: [{ id: 1, name: "Design" }],
          comments: []
        }
      ]
    },
    {
      id: 3,
      name: "Backend API Refactor",
      description: "Modernize backend architecture",
      due_date: "2024-10-15",
      created_at: "2024-08-01",
      progress: 80,
      color: "#ff9800",
      owner: "Bob",
      users: [
        { id: 2, username: "Bob", role: "Owner" },
        { id: 3, username: "Charlie", role: "Member" }
      ],
      tasks: [
        {
          id: 6,
          title: "Database migration",
          description: "Move to PostgreSQL",
          status: "Done",
          priority: "High",
          due_date: "2024-08-15",
          dueDate: "2024-08-15",
          assignee: "B",
          assigneeData: { id: 2, username: "Bob" },
          tags: [{ id: 5, name: "Database" }],
          comments: []
        },
        {
          id: 7,
          title: "API documentation",
          description: "Update all endpoint docs",
          status: "In Progress",
          priority: "Low",
          due_date: "2024-09-30",
          dueDate: "2024-09-30",
          assignee: "C",
          assigneeData: { id: 3, username: "Charlie" },
          tags: [{ id: 6, name: "Documentation" }],
          comments: []
        }
      ]
    }
  ]);

  // Legacy tasks array - keeping for compatibility
  const [tasks, setTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);

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

  const handleAddTask = (taskData) => {
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
    navigate('/');
  };

  // Handle category change from Layout
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle filtered projects change from Layout
  const handleFilteredProjectsChange = (projects) => {
    setFilteredProjects(projects);
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
        projects={projects}
        currentUser={currentUser}
        onCategoryChange={handleCategoryChange}
        onFilteredProjectsChange={handleFilteredProjectsChange}
      >
        <Routes>            <Route 
              path="/" 
              element={
                <Dashboard 
                  key="dashboard"
                  tasks={getAllTasks()}
                  projects={filteredProjects.length > 0 ? filteredProjects : projects}
                  selectedCategory={selectedCategory}
                  currentUser={currentUser}
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
            path="/add-task" 
            element={
              <AddTask 
                open={false}
                onSave={handleAddTask}
                onClose={goBackToDashboard}
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
          onSave={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
}

export default App;
