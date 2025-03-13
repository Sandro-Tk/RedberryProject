import React from "react";
import { TaskColumn } from "./TaskColumn";

export function TaskBoard({ tasks, filters }) {
    const filteredTasks = tasks.filter((task) => {
        return (
            (filters.department.length === 0 ||
                filters.department.includes(task.department)) &&
            (filters.priority.length === 0 ||
                filters.priority.includes(task.priority)) &&
            (filters.employee.length === 0 ||
                filters.employee.includes(task.employee))
        );
    });
    const columns = [
        { title: "დასაწყები", color: "##F7BC30" },
        { title: "პროგრესში", color: "##FB5607" },
        { title: "მზად ტესტირებისთვის", color: "##FF006E" },
        { title: "დასრულებული", color: "##3A86FF" },
    ];

    return (
        <div className="task-board">
            {columns.map((column) => (
                <TaskColumn
                    key={column.title}
                    title={column.title}
                    color={column.color}
                    tasks={filteredTasks.filter(
                        (task) => task.status === column.title
                    )}
                />
            ))}
        </div>
    );
}
