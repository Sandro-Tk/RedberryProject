import React, { useState, useEffect } from "react";
import { API_KEY, API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import ge from "date-fns/locale/ka";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import EmployeeDropdown from "../EmployeeDropdown/EmployeeDropdown";
import "./AddTaskPage.css";

registerLocale("ge", ge);

export default function AddTaskPage() {
    const [descriptionError, setDescriptionError] = useState("");
    const [descriptionMaxError, setDescriptionMaxError] = useState("");
    const [titleError, setTitleError] = useState("");
    const [titleMaxError, setTitleMaxError] = useState("");
    const [employeeError, setEmployeeError] = useState("");
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [priority, setPriority] = useState(
        localStorage.getItem("priority") || ""
    );
    const [selectedDepartment, setSelectedDepartment] = useState(
        localStorage.getItem("selectedDepartment") || ""
    );
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(
        localStorage.getItem("selectedEmployee") || ""
    );
    const [dueDate, setDueDate] = useState(addDays(new Date(), 1));
    const [taskTitle, setTaskTitle] = useState(
        localStorage.getItem("taskTitle") || ""
    );
    const [taskDescription, setTaskDescription] = useState(
        localStorage.getItem("taskDescription") || ""
    );
    const navigate = useNavigate();

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

    useEffect(() => {
        if (selectedDepartment) {
            const filtered = employees.filter(
                (employee) =>
                    employee.department.id === parseInt(selectedDepartment, 10)
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees([]);
        }
    }, [selectedDepartment, employees]);

    useEffect(() => {
        localStorage.setItem("taskTitle", taskTitle);
    }, [taskTitle]);

    useEffect(() => {
        localStorage.setItem("taskDescription", taskDescription);
    }, [taskDescription]);

    useEffect(() => {
        localStorage.setItem("priority", priority);
    }, [priority]);

    useEffect(() => {
        localStorage.setItem("selectedDepartment", selectedDepartment);
    }, [selectedDepartment]);

    useEffect(() => {
        localStorage.setItem("selectedEmployee", selectedEmployee);
    }, [selectedEmployee]);

    const validateInput = (
        value,
        setError,
        setMaxError,
        inputId,
        minLength,
        maxLength,
        minWords
    ) => {
        const inputElement = document.getElementById(inputId);
        const wordCount = value.trim().split(/\s+/).length;
        if (value.length === 0) {
            setError("");
            setMaxError("");
            inputElement.style.border = "1px solid #dee2e6";
        } else if (minWords && wordCount < minWords) {
            setError(`აღწერაში უნდა იყოს მინიმუმ ${minWords} სიტყვა`);
            setMaxError("");
            inputElement.style.border = "1px solid #FA4D4D";
        } else if (value.length < minLength) {
            setError(`სათაური უნდა იყოს მინიმუმ ${minLength} სიმბოლო`);
            setMaxError("");
            inputElement.style.border = "1px solid #FA4D4D";
        } else if (value.length > maxLength) {
            setMaxError(`სათაური უნდა იყოს მაქსიმუმ ${maxLength} სიმბოლო`);
            setError("valid");
            inputElement.style.border = "1px solid #FA4D4D";
        } else {
            setError("valid");
            setMaxError("valid");
            inputElement.style.border = "1px solid #dee2e6";
        }
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTaskTitle(value);
        validateInput(
            value,
            setTitleError,
            setTitleMaxError,
            "task-title",
            3,
            255
        );
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setTaskDescription(value);
        validateInput(
            value,
            setDescriptionError,
            setDescriptionMaxError,
            "task-description",
            0,
            255,
            4
        );
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const status = e.target["status"].value;
        const employee = selectedEmployee;

        if (!employee) {
            setEmployeeError("გთხოვთ აირჩიოთ თანამშრომელი");
            return;
        } else {
            setEmployeeError("");
        }

        if (taskDescription) {
            const wordCount = taskDescription.trim().split(/\s+/).length;
            if (wordCount < 4) {
                setDescriptionError("აღწერაში უნდა იყოს მინიმუმ 4 სიტყვა");
                return;
            } else if (taskDescription.length > 255) {
                setDescriptionMaxError("აღწერა უნდა იყოს მაქსიმუმ 255 სიმბოლო");
                return;
            }
        } else {
            setDescriptionError("");
            setDescriptionMaxError("");
        }

        const taskData = {
            name: taskTitle,
            description: taskDescription,
            due_date: dueDate ? dueDate.toISOString().split("T")[0] : null,
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
            localStorage.removeItem("taskTitle");
            localStorage.removeItem("taskDescription");
            localStorage.removeItem("priority");
            localStorage.removeItem("selectedDepartment");
            localStorage.removeItem("selectedEmployee");
            navigate("/");
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="add-task-page">
            <span className="page-title">შექმენი ახალი დავალება</span>
            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-1">
                    <div className="form-title">
                        <label htmlFor="task-title">სათაური*</label>
                        <input
                            type="text"
                            id="task-title"
                            name="task-title"
                            minLength="2"
                            maxLength="255"
                            required
                            value={taskTitle}
                            onChange={handleTitleChange}
                            style={{
                                border:
                                    titleError === "valid" || titleError === ""
                                        ? "1px solid #dee2e6"
                                        : "1px solid #FA4D4D",
                            }}
                        />
                        <small
                            className={
                                titleError === ""
                                    ? "gray"
                                    : titleError === "valid"
                                    ? "valid"
                                    : "error"
                            }
                        >
                            მინიმუმ 3 სიმბოლო
                        </small>
                        <small
                            className={
                                titleMaxError === ""
                                    ? "gray"
                                    : titleMaxError === "valid"
                                    ? "valid"
                                    : "error"
                            }
                        >
                            მაქსიმუმ 255 სიმბოლო
                        </small>
                    </div>
                    <div className="form-description">
                        <label htmlFor="task-description">აღწერა</label>
                        <textarea
                            id="task-description"
                            name="task-description"
                            value={taskDescription}
                            onChange={handleDescriptionChange}
                            style={{
                                border:
                                    descriptionError === "valid" ||
                                    descriptionError === ""
                                        ? "1px solid #dee2e6"
                                        : "1px solid #FA4D4D",
                            }}
                        ></textarea>
                        <small
                            className={
                                descriptionError === ""
                                    ? "gray"
                                    : descriptionError === "valid"
                                    ? "valid"
                                    : "error"
                            }
                        >
                            მინიმუმ 4 სიტყვა
                        </small>
                        <small
                            className={
                                descriptionMaxError === ""
                                    ? "gray"
                                    : descriptionMaxError === "valid"
                                    ? "valid"
                                    : "error"
                            }
                        >
                            მაქსიმუმ 255 სიმბოლო
                        </small>
                    </div>
                    <div className="form-row">
                        <div className="form-priority">
                            <label>პრიორიტეტი*</label>
                            <PriorityDropdown
                                options={priorities}
                                value={priority}
                                onChange={handlePriorityChange}
                            />
                        </div>
                        <div className="form-status">
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
                <div className="form-2">
                    <div className="form-department ">
                        <label htmlFor="department">დეპარტამენტი*</label>
                        <select
                            id="department"
                            name="department"
                            required
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                        >
                            <option value="">აირჩიეთ დეპარტამენტი</option>
                            {departments.map((department) => (
                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </option>
                            ))}
                        </select>
                        {selectedDepartment && (
                            <div className="form-employee">
                                <label htmlFor="employee-dropdown">
                                    პასუხისმგებელი თანამშრომელი*
                                </label>
                                <EmployeeDropdown
                                    employees={filteredEmployees}
                                    value={selectedEmployee}
                                    onChange={handleEmployeeChange}
                                />
                                {employeeError && (
                                    <small className="error">
                                        {employeeError}
                                    </small>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="form-deadline">
                        <label htmlFor="due-date">დედლაინი</label>
                        <div className="deadline-input-container">
                            <img
                                className="deadline-icon"
                                src="../icons/deadline.png"
                                alt=""
                            />
                            <DatePicker
                                id="due-date"
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                dateFormat="dd/MM/yyyy"
                                locale="ge"
                                placeholderText="DD/MM/YYYY"
                                className="custom-datepicker"
                                minDate={new Date()}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="submit-button">
                    დავალების შექმნა
                </button>
            </form>
        </div>
    );
}
