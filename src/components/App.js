import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Filters from "./Filters/Filters";
import TaskBoard from "./TaskBoard/TaskBoard";
import Modal from "./Modal/Modal";
import AddTaskPage from "./AddTaskPage/AddTaskPage";
import TaskDetails from "./TaskDetailsPage/TaskDetailsPage";

export const API_URL = "https://momentum.redberryinternship.ge/api";
export const API_KEY = "9e78a7ca-82db-4646-9b40-0a68986d0cdd";

function AppContent() {
    const [tasks, setTasks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filters, setFilters] = useState({
        department: [],
        priority: [],
        employee: [],
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [dropdowns, setDropdowns] = useState({
        department: false,
        priority: false,
        employee: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmedFilters, setConfirmedFilters] = useState(filters);

    // API calls
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

    const handleDropdown = (type, value) => {
        setDropdowns((prevDropdowns) => {
            const newDropdowns = {
                department: false,
                priority: false,
                employee: false,
            };
            return {
                ...newDropdowns,
                [type]: value !== undefined ? value : !prevDropdowns[type],
            };
        });
    };

    const handleConfirmFilters = () => {
        console.log("Confirming filters:", tempFilters);
        setConfirmedFilters(tempFilters);
    };

    function addEmployee(newEmployee) {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    }

    useEffect(() => {
        console.log("Confirmed filters updated:", confirmedFilters);
    }, [confirmedFilters]);

    useEffect(() => {
        console.log("Temp filters updated:", tempFilters);
    }, [tempFilters]);

    useEffect(() => {
        console.log("Filters updated:", filters);
    }, [filters]);

    const filterTasks = (tasks, filters) => {
        return tasks.filter((task) => {
            const departmentMatch =
                filters.department.length === 0 ||
                filters.department.includes(task.department);
            const priorityMatch =
                filters.priority.length === 0 ||
                filters.priority.includes(task.priority);
            const employeeMatch =
                filters.employee.length === 0 ||
                filters.employee.includes(task.employee);

            return departmentMatch && priorityMatch && employeeMatch;
        });
    };

    const filteredTasks = filterTasks(tasks, confirmedFilters);

    return (
        <>
            <Navbar onOpenModal={() => setIsModalOpen(true)} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <p className="subheader">დავალებების გვერდი</p>

                            <Filters
                                dropdowns={dropdowns}
                                filters={filters}
                                tempFilters={tempFilters}
                                setTempFilters={setTempFilters}
                                departments={departments}
                                priorities={priorities}
                                employees={employees}
                                onHandleDropdown={handleDropdown}
                                onConfirmFilters={handleConfirmFilters}
                                setFilters={setFilters}
                            />
                            <TaskBoard
                                tasks={filteredTasks}
                                filters={confirmedFilters}
                            />
                        </>
                    }
                />
                <Route path="/add-task" element={<AddTaskPage />} />
                <Route path="/task/:taskId" element={<TaskDetails />} />
            </Routes>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                departments={departments}
                addEmployee={addEmployee}
            />
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
