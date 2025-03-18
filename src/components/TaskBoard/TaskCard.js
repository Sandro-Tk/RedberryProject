import React from "react";
import { useNavigate } from "react-router-dom";
import "./TaskBoard";

export default function TaskCard({ task, borderColor }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/task/${task.id}`);
    };

    const priorityClassMap = {
        დაბალი: "priority-low",
        საშუალო: "priority-medium",
        მაღალი: "priority-high",
    };

    const truncateDescription = (description) => {
        if (description.length > 100) {
            return description.substring(0, 100) + "...";
        }
        return description;
    };

    return (
        <div
            className="task-card"
            style={{ borderColor }}
            onClick={handleClick}
        >
            <div className="task-header">
                <span
                    className={`tag priority ${
                        priorityClassMap[task.priority.name]
                    }`}
                >
                    <img src={task.priority.icon} alt={task.priority.name} />
                    {task.priority.name}
                </span>
                <span className="tag department">{task.department.name}</span>
                <span className="due-date">
                    {new Date(task.due_date).toLocaleDateString()}
                </span>
            </div>
            <p className="task-name">{task.name}</p>
            <p className="task-description">{truncateDescription(task.description)}</p>
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
