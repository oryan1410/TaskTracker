import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react'

import { createUserWithEmailAndPassword ,signInWithEmailAndPassword } from "firebase/auth";
import {auth} from './firebase_setup/firebase'; // Adjust the import path as necessary

const UserContext = createContext()
const UserUpdateContext = createContext()

export function useUserContext() {
    return useContext(UserContext)
}
// Projects data with tasks
const initialProjects = [
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
                status: "Done",
                priority: "Medium",
                due_date: "2024-09-15",
                dueDate: "2024-09-15",
                assignee: "A",
                assigneeData: { id: 1, username: "Alice" },
                tags: [{ id: 2, name: "Content" }],
                comments: [],
                completed_at: "2025-07-12"
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
                comments: [{ author: "Alice", content: "Great job on the setup!", date: "2024-06-15" }, { author: "Charlie", content: "Thanks Alice!", date: "2024-06-16T12:00:00Z" }]
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
            { id: 3, username: "Charlie", role: "Member" },
            { id: 1, username: "Alice", role: "Member" }
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
];


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState("Alice");
    const [userTasks, setUserTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [allTasks, setAllTasks] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [projects, setProjects] = useState(initialProjects);

    const getPriorityColor = useCallback((priority) => {
        switch (priority) {
            case 'High': return '#f44336';
            case 'Medium': return '#ff9800';
            case 'Low': return '#4caf50';
            default: return '#9e9e9e';
        }
    }, []);


    useEffect(() => {
        const updatedAllTasks = projects.flatMap(project => project.tasks || []);
        setAllTasks(updatedAllTasks);
    }, [projects]);


    const updateAllTasks = useCallback((task) => {
        setAllTasks(prevTasks => [...prevTasks, task]);
    }, []);

    // useEffect(() => {
    //     console.log('All tasks updated:', allTasks);
    // }, [allTasks]);

    // Memoized filtered projects - only recalculates when dependencies change
    const filteredProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        switch (selectedCategory) {
            case 'Owned':
                return projects.filter(project => project.owner === user);
            case 'Shared':
                return projects.filter(project =>
                    project.owner !== user &&
                    project.users.some(u => u.username === user)
                );
            case 'All':
            default:
                return projects.filter(project =>
                    project.owner === user ||
                    project.users.some(u => u.username === user)
                );
        }
    }, [projects, selectedCategory, user]);

    // Separate memoized userProjects if still needed
    const userProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        return projects.filter(project => project.users.some(u => u.username === user));
    }, [projects, user]);



    // Function that returns the memoized filtered projects (for backward compatibility)
    const getFilteredProjects = () => {
        return filteredProjects;
    };

    const AddProject = useCallback((projectData) => {
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
    }, [user]);

    const changeTaskStatus = useCallback((taskId, newStatus) => {
        setProjects(prevProjects => {
            const updatedProjects = prevProjects.map(project =>
                project.id === selectedProject.id
                    ? {
                        ...project,
                        tasks: project.tasks.map(task =>
                            task.id === taskId
                                ? {
                                    ...task,
                                    status: newStatus,
                                    // Add completion timestamp when task is marked as Done
                                    ...(newStatus === 'Done' && task.status !== 'Done'
                                        ? { completed_at: new Date().toISOString().split('T')[0] }
                                        : {}),
                                    // Remove completion timestamp if task is moved back from Done
                                    ...(newStatus !== 'Done' && task.status === 'Done'
                                        ? { completed_at: undefined }
                                        : {})
                                }
                                : task
                        )
                    }
                    : project
            );

            // Update selected project
            const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
            setSelectedProject(updatedSelectedProject);

            return updatedProjects;
        });
    }, [selectedProject]);

    const updateProject = useCallback((updatedProject) => {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === updatedProject.id ? updatedProject : project
            )
        );

        // Update selected project if it's the one being updated
        if (selectedProject && selectedProject.id === updatedProject.id) {
            setSelectedProject(updatedProject);
        }
    }, [selectedProject]);

    const addPartnerToProject = useCallback((projectId, partner) => {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === projectId
                    ? {
                        ...project,
                        users: [...(project.users || []), partner]
                    }
                    : project
            )
        );
    }, []);

    const removePartnerFromProject = useCallback((projectId, partnerId) => {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === projectId
                    ? {
                        ...project,
                        users: (project.users || []).filter(user => user.id !== partnerId)
                    }
                    : project
            )
        );
    }, []);

    const updateTask = useCallback((updatedTask) => {
        setProjects(prevProjects => {
            const updatedProjects = prevProjects.map(project => {
                // Find the project that contains this task
                const taskExists = project.tasks.some(t => t.id === updatedTask.id);
                if (taskExists) {
                    const updatedProject = {
                        ...project,
                        tasks: project.tasks.map(t =>
                            t.id === updatedTask.id ? { ...t, ...updatedTask } : t
                        )
                    };

                    // Update selected project if this is the selected project
                    if (selectedProject && selectedProject.id === project.id) {
                        setSelectedProject(updatedProject);
                    }

                    return updatedProject;
                }
                return project;
            });

            return updatedProjects;
        });
    }, [selectedProject]);

    // Handle login success
    const handleUserLogin = async (loginData) => {
        try {
            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
            console.log('Login successful:', loginData);
            setIsAuthenticated(true);
            return true; // Simulate successful login
            // navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    //     async function logInFireBase(email, password) {
    //     signInWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             console.log('user logged in');
    //             // getChatConvo(userCredential.user.email)
    //         })
    //         .catch((error) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             alert(errorMessage);
    //         });
    // }



    const valueToGet = useMemo(() => ({
        user,
        setUser,
        projects,
        setProjects,
        AddProject,
        selectedProject,
        setSelectedProject,
        userTasks,
        changeTaskStatus,
        filteredProjects,
        selectedCategory,
        setSelectedCategory,
        getPriorityColor,
        userProjects,
        allTasks,
        updateAllTasks,
        updateProject,
        addPartnerToProject,
        removePartnerFromProject,
        updateTask,
        handleUserLogin
    }), [
        user,
        projects,
        selectedProject,
        userTasks,
        selectedCategory,
        allTasks
        // Remove memoized values from dependencies - they're derived
    ]);

    return (
        <UserContext.Provider value={valueToGet}>
            {children}
        </UserContext.Provider>
    );
};