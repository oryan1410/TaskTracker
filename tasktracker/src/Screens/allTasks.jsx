import React from 'react';
import { useUserContext } from '../UserContext';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TaskView = ({ task }) => {
    const { user, userTasks } = useUserContext();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
            <div
                style={{
                    ...styles.taskDiv,
                    background: task.status==="Done" ? '#e0ffe0' : '#fff',
                }}
            >
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskDescription}>{task.description}</p>
                <span
                    style={{...styles.taskAssignee, color: task.status==="Done" ? 'green' : 'red'}}
                >
                    {task.status==="Done" ? 'Completed' : `${task.status}`}
                </span>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/task/${task.id}`)}
                style={{ marginTop: '8px' }}
            >
                View Task Details
            </Button>
        </div>
    );
}

const AllTasks = ({ tasks }) => (
    <div style={{ margin: '0 auto', padding: '24px' }}>
        <h2>All Tasks</h2>
        {tasks && tasks.length > 0 ? (
            tasks.map((task) => <TaskView key={task.id} task={task} />)
        ) : (
            <p>No tasks available.</p>
        )}
    </div>
);

export default AllTasks;

const styles = {
    taskDiv: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
    },
    taskTitle: {
         margin: 0
    },
    taskDescription: {
        margin: '8px 0'
    },
    taskAssignee: {
        fontWeight: 'bold',
    }

}