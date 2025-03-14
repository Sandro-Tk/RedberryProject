import React from "react";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks }) {

    return (
        <div className="task-column">
            <h2>{title}</h2>
            <div className="task-list">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}
