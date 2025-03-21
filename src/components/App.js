import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import "@fontsource/firago";
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
    const [filters, setFilters] = useState(() => {
        const savedFilters = localStorage.getItem("selectedFilters");
        return savedFilters
            ? JSON.parse(savedFilters)
            : {
                  department: [],
                  priority: [],
                  employee: [],
              };
    });
    const [dropdowns, setDropdowns] = useState({
        department: false,
        priority: false,
        employee: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();

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

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem("selectedFilters", JSON.stringify(filters));
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [filters]);

    useEffect(() => {
        localStorage.removeItem("selectedFilters");
    }, [location]);

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

    const handleConfirmFilters = (confirmedFilters) => {
        setFilters(confirmedFilters);
        localStorage.setItem(
            "selectedFilters",
            JSON.stringify(confirmedFilters)
        );
    };

    function addEmployee(newEmployee) {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    }

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
                                departments={departments}
                                priorities={priorities}
                                employees={employees}
                                onHandleDropdown={handleDropdown}
                                onConfirmFilters={handleConfirmFilters}
                            />
                            <TaskBoard tasks={tasks} filters={filters} />
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
