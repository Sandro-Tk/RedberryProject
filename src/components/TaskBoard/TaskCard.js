import React from "react";

export default function TaskCard({ task }) {

    return (
        <div className="task-card">
            <div className="task-header">
                <span className="tag priority">
                    <img src={task.priority.icon} alt={task.priority.name} />
                    {task.priority.name}
                </span>
                <span className="tag department">{task.department.name}</span>
                <span className="due-date">
                    {new Date(task.due_date).toLocaleDateString()}
                </span>
            </div>
            <h4>{task.name}</h4>
            <p>{task.description}</p>
            <div className="task-footer">
                <img
                    src={task.employee.avatar}
                    alt="User"
                    className="user-avatar"
                />
                <span className="comments">💬 {task.total_comments}</span>
            </div>
        </div>
    );
}
