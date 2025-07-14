import React from 'react';
import { useUserContext } from '../UserContext';

const TaskView = ({ task }) => {
    const { user, userTasks } = useUserContext();
    return (
        <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
            <div
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    background: task.completed ? '#e0ffe0' : '#fff',
                }}
            >
                <h3 style={{ margin: 0 }}>{task.title}</h3>
                <p style={{ margin: '8px 0' }}>{task.description}</p>
                <span
                    style={{
                        color: task.completed ? 'green' : 'red',
                        fontWeight: 'bold',
                    }}
                >
                    {task.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
        </div>
    );
}

const AllTasks = ({ tasks }) => (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
        <h2>All Tasks</h2>
        {tasks && tasks.length > 0 ? (
            tasks.map((task) => <TaskView key={task.id} task={task} />)
        ) : (
            <p>No tasks available.</p>
        )}
    </div>
);

export default AllTasks;