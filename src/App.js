import React from "react";
import { useState } from "react";
import { useEffect } from "react";
const API_URL = "https://momentum.redberryinternship.ge/api";
const API_KEY = "9e6a5700-6498-414a-acfb-a123cf18c85e";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filters, setFilters] = useState({
        department: [],
        priority: [],
        employee: [],
    });

    const [dropdowns, setDropdowns] = useState({
        department: false,
        priority: false,
        employee: false,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    tasksResponse,
                    departmentsResponse,
                    prioritiesResponse,
                    employeesResponse,
                ] = await Promise.all([
                    fetch(`${API_URL}/tasks`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                    fetch(`${API_URL}/departments`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }),
                    fetch(`${API_URL}/priorities`, {
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

                const tasksData = await tasksResponse.json();
                const departmentsData = await departmentsResponse.json();
                const prioritiesData = await prioritiesResponse.json();
                const employeesData = await employeesResponse.json();

                console.log(employeesData);
                setTasks(tasksData);
                setDepartments(departmentsData);
                setPriorities(prioritiesData);
                setEmployees(employeesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    function handleDropdown(filterType) {
        setDropdowns((prevDropdowns) => ({
            department:
                filterType === "department" ? !prevDropdowns.department : false,
            priority:
                filterType === "priority" ? !prevDropdowns.priority : false,
            employee:
                filterType === "employee" ? !prevDropdowns.employee : false,
        }));
    }

    function handleCheckboxChange(filterType, value) {
        setFilters((prevFilters) => {
            const newFilterValues = prevFilters[filterType].includes(value)
                ? prevFilters[filterType].filter((item) => item !== value)
                : [...prevFilters[filterType], value];
            return {
                ...prevFilters,
                [filterType]: newFilterValues,
            };
        });
    }

    return (
        <div>
            <Navbar />
            <Filters
                dropdowns={dropdowns}
                filters={filters}
                departments={departments}
                priorities={priorities}
                employees={employees}
                onHandleDropdown={handleDropdown}
                onHandleCheckboxChange={handleCheckboxChange}
            />
            <TaskBoard tasks={tasks} filters={filters} />
        </div>
    );
}

function Navbar() {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <span className="nav-title">Momentum</span>
                    <img
                        src="icons/Hourglass.png"
                        alt=""
                        className="nav-icon"
                    />
                </div>
                <div className="navbar-right">
                    <button className="add-employee-button">
                        თანამშრომლის შექმნა
                    </button>
                    <button className="add-task-btn">
                        add + png later შექმენი ახალი დავალება
                    </button>
                </div>
            </nav>
            <p className="subheader">დავალებების გვერდი</p>
        </>
    );
}

function Filters({
    dropdowns,
    filters,
    departments,
    priorities,
    employees,
    onHandleDropdown,
    onHandleCheckboxChange,
}) {
    return (
        <div className="filters-container">
            <div className="filters">
                <div className="filter">
                    <button
                        className="filter-button"
                        onClick={() => onHandleDropdown("department")}
                    >
                        დეპარტამენტი {dropdowns.department ? "▲" : "▼"}
                    </button>
                </div>
                <div className="filter">
                    <button
                        className="filter-button"
                        onClick={() => onHandleDropdown("priority")}
                    >
                        პრიორიტეტი {dropdowns.priority ? "▲" : "▼"}
                    </button>
                </div>
                <div className="filter">
                    <button
                        className="filter-button"
                        onClick={() => onHandleDropdown("employee")}
                    >
                        თანამშრომელი {dropdowns.employee ? "▲" : "▼"}
                    </button>
                </div>
            </div>
            <div className="dropdowns">
                {dropdowns.department && (
                    <div className="dropdown">
                        {departments.map((department) => (
                            <label
                                key={department.id}
                                className="dropdown-item"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.department.includes(
                                        department.name
                                    )}
                                    onChange={() =>
                                        onHandleCheckboxChange(
                                            "department",
                                            department.name
                                        )
                                    }
                                />
                                {department.name}
                            </label>
                        ))}
                    </div>
                )}
                {dropdowns.priority && (
                    <div className="dropdown">
                        {priorities.map((priority) => (
                            <label key={priority.id} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    checked={filters.priority.includes(
                                        priority.name
                                    )}
                                    onChange={() =>
                                        onHandleCheckboxChange(
                                            "priority",
                                            priority.name
                                        )
                                    }
                                />
                                {priority.name}
                            </label>
                        ))}
                    </div>
                )}
                {dropdowns.employee && (
                    <div className="dropdown">
                        {employees.map((employee) => (
                            <label key={employee.id} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    checked={filters.employee.includes(
                                        employee.name
                                    )}
                                    onChange={() =>
                                        onHandleCheckboxChange(
                                            "employee",
                                            employee.name
                                        )
                                    }
                                />
                                {employee.name}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskBoard({ tasks, filters }) {
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

function TaskColumn({ title, tasks, color }) {
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

function TaskCard({ task }) {
    return (
        <div
            className="task-card"
            style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
            }}
        >
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
