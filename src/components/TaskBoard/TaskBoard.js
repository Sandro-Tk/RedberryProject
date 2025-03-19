import React, { useState, useEffect } from "react";
import TaskColumn from "./TaskColumn";
import "./TaskBoard.css";
import { API_KEY, API_URL } from "../App";

export default function TaskBoard({ filters }) {
    const [tasks, setTasks] = useState([]);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [tasksResponse, statusesResponse] = await Promise.all([
                    fetch(`${API_URL}/tasks`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                    fetch(`${API_URL}/statuses`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                ]);

                const tasksData = await tasksResponse.json();
                const statusesData = await statusesResponse.json();

                setTasks(tasksData);
                setStatuses(statusesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const filteredTasks = tasks.filter((task) => {
        return (
            (filters.department.length === 0 ||
                filters.department.includes(task.department.name)) &&
            (filters.priority.length === 0 ||
                filters.priority.includes(task.priority.name)) &&
            (filters.employee.length === 0 ||
                filters.employee.includes(task.employee.id))
        );
    });

    const statusColors = {
        დასაწყები: "#F4B740",
        პროგრესში: "#EB5757",
        "მზად ტესტირებისთვის": "#FF006E",
        დასრულებული: "#2F80ED",
    };

    return (
        <div className="task-board">
            {statuses.map((status) => (
                <TaskColumn
                    key={status.id}
                    title={status.name}
                    tasks={filteredTasks.filter(
                        (task) => task.status.id === status.id
                    )}
                    titleColor={statusColors[status.name]}
                />
            ))}
        </div>
    );
}
