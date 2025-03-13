import React from "react";
import { TaskCard } from "./TaskCard";

export function TaskColumn({ title, tasks, color }) {
    return (
        <div className="task-column">
            <h3 className="column-title" style={{ backgroundColor: color }}>
                {title}
            </h3>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}
