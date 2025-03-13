import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Filters } from "./Filters";
import { TaskBoard } from "./TaskBoard";
import { Modal } from "./Modal";
export const API_URL = "https://momentum.redberryinternship.ge/api";
export const API_KEY = "9e6c900b-d1a4-45a7-ade1-f91a676a2dd6";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
 
    function handleConfirmFilters() {
        setDropdowns({
            department: false,
            priority: false,
            employee: false,
        });
    }

    function addEmployee(newEmployee) {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    }

    return (
        <div>
            <Navbar onOpenModal={() => setIsModalOpen(true)} />
            <Filters
                dropdowns={dropdowns}
                filters={filters}
                departments={departments}
                priorities={priorities}
                employees={employees}
                onHandleDropdown={handleDropdown}
                onHandleCheckboxChange={handleCheckboxChange}
                onConfirmFilters={handleConfirmFilters}
            />
            <TaskBoard tasks={tasks} filters={filters} />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                departments={departments}
                addEmployee={addEmployee}
            />
        </div>
    );
}
