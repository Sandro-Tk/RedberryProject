import React from "react";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks, titleColor }) {
    return (
        <div className="task-column">
            <h2 style={{ backgroundColor: titleColor }}>{title}</h2>
            <div className="task-list">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        borderColor={titleColor}
                    />
                ))}
            </div>
        </div>
    );
}
