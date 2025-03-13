import React from "react";

export function TaskCard({ task }) {
    return (
        <div className="task-card">
            <div className="task-header">
                <span className={`tag ${task.priority.toLowerCase()}`}>
                    {task.priority}
                </span>
                <span className={`tag ${task.status.toLowerCase()}`}>
                    {task.status}
                </span>
            </div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="task-footer">
                <img src={task.userAvatar} alt="User" className="user-avatar" />
                <span className="comments">💬 {task.comments}</span>
            </div>
        </div>
    );
}
