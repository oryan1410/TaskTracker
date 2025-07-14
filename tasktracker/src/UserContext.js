import React, { useState, useEffect, createContext, useContext } from 'react'

import { useNavigate } from 'react-router-dom';

const UserContext = createContext()
const UserUpdateContext = createContext()

export function useUserContext() {
    return useContext(UserContext)
}
  // Projects data with tasks

  
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState("Charlie");
    const [userTasks, setUserTasks] = useState([]);

      const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Revamp the company website",
      due_date: "2024-12-15",
      created_at: "2024-07-14",
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
          comments: [{author: "Alice", content: "Great job on the setup!", date: "2024-06-15" },{author: "Charlie", content: "Thanks Alice!", date: "2024-06-16T12:00:00Z"}]
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


  useEffect(() => {
    
    }, [user, projects]);

  const AddProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      name: projectData.name,
      description: projectData.description,
      due_date: projectData.dueDate,
      created_at: new Date().toISOString().split('T')[0],
      color: projectData.color,
      owner: user,
      users: [
        { id: 1, username: user, role: "Owner" },
        ...(projectData.teamMembers || []).map((email, index) => ({
          id: Date.now() + index + 1,
          username: email,
          role: "Member"
        }))
      ],
      tasks: projectData.tasks || []
    };
    
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setUserTasks((prevTasks) => [...prevTasks, ...newProject.tasks]);
  };

  const valueToGet = {
    user,
    setUser,
    projects,
    setProjects,
    AddProject
  };

    return (
        <UserContext.Provider value={valueToGet}>
            {children}
        </UserContext.Provider>
    );
};