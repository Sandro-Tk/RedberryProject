import React, { useState, useEffect } from "react";
import "./AddTaskPage.css";
import { API_KEY, API_URL } from "../App";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";

export default function AddTaskPage() {
    const [descriptionError, setDescriptionError] = useState("");
    const [titleError, setTitleError] = useState("");
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [priority, setPriority] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    prioritiesResponse,
                    statusesResponse,
                    departmentsResponse,
                    employeesResponse,
                ] = await Promise.all([
                    fetch(`${API_URL}/priorities`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                    fetch(`${API_URL}/statuses`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                    fetch(`${API_URL}/departments`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                    fetch(`${API_URL}/employees`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                ]);

                const prioritiesData = await prioritiesResponse.json();
                const statusesData = await statusesResponse.json();
                const departmentsData = await departmentsResponse.json();
                const employeesData = await employeesResponse.json();

                setPriorities(prioritiesData);
                setStatuses(statusesData);
                setDepartments(departmentsData);
                setEmployees(employeesData);

                const defaultPriority = prioritiesData.find(
                    (priority) => priority.name === "საშუალო"
                );
                if (defaultPriority) {
                    setPriority(defaultPriority.id);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length < 2) {
            setTitleError("სათაური უნდა იყოს მინიმუმ 2 სიმბოლო");
        } else if (value.length > 255) {
            setTitleError("სათაური უნდა იყოს მაქსიმუმ 255 სიმბოლო");
        } else {
            setTitleError("");
        }
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        const wordCount = value.trim().split(/\s+/).length;
        if (value && wordCount < 4) {
            setDescriptionError("აღწერაში უნდა იყოს მინიმუმ 4 სიტყვა");
        } else if (value.length > 255) {
            setDescriptionError("აღწერა უნდა იყოს მაქსიმუმ 255 სიმბოლო");
        } else {
            setDescriptionError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskTitle = e.target["task-title"].value;
        const taskDescription = e.target["task-description"].value;
        const status = e.target["status"].value;
        const dueDate = e.target["due-date"].value;
        const employee = e.target["assignee"].value;

        if (taskDescription) {
            const wordCount = taskDescription.trim().split(/\s+/).length;
            if (wordCount < 4) {
                setDescriptionError("აღწერაში უნდა იყოს მინიმუმ 4 სიტყვა");
                return;
            } else if (taskDescription.length > 255) {
                setDescriptionError("აღწერა უნდა იყოს მაქსიმუმ 255 სიმბოლო");
                return;
            }
        } else {
            setDescriptionError("");
        }

        const taskData = {
            name: taskTitle,
            description: taskDescription,
            due_date: dueDate,
            status_id: status,
            employee_id: employee,
            priority_id: priority,
        };

        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("Task created successfully:", result);

            e.target.reset();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="add-task-page">
            <h1 className="page-title">შექმენი ახალი დავალება</h1>
            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-left">
                    <div className="form-group">
                        <label htmlFor="task-title">სათაური*</label>
                        <input
                            type="text"
                            id="task-title"
                            name="task-title"
                            minLength="2"
                            maxLength="255"
                            required
                            onChange={handleTitleChange}
                        />
                        <small>მინიმუმ 2 სიმბოლო მაქსიმუმ 255 სიმბოლო</small>
                        {titleError && (
                            <small className="error">{titleError}</small>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-description">აღწერა</label>
                        <textarea
                            id="task-description"
                            name="task-description"
                            onChange={handleDescriptionChange}
                        ></textarea>
                        <small>მინიმუმ 4 სიტყვა მაქსიმუმ 255 სიმბოლო</small>
                        {descriptionError && (
                            <small className="error">{descriptionError}</small>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>პრიორიტეტი*</label>
                            <PriorityDropdown
                                options={priorities}
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">სტატუსი*</label>
                            <select id="status" name="status" required>
                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-right">
                    <div className="form-group">
                        <label htmlFor="department">დეპარტამენტი*</label>
                        <select id="department" name="department" required>
                            {departments.map((department) => (
                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="assignee">
                            პასუხისმგებელი თანამშრომელი*
                        </label>
                        <select id="assignee" name="assignee" required>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="due-date">დედლაინი</label>
                        <input type="date" id="due-date" name="due-date" />
                    </div>
                </div>
                <button type="submit" className="submit-button">
                    დავალების შექმნა
                </button>
            </form>
        </div>
    );
}
