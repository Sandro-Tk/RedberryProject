import React, { useState } from "react";
import "./Filters.css";

export default function Filters({
    dropdowns,
    filters,
    departments,
    priorities,
    employees,
    onHandleDropdown,
    onConfirmFilters,
}) {
    const [selectedFilters, setSelectedFilters] = useState(filters);

    const handleCheckboxChange = (type, value) => {
        const updatedFilters = { ...selectedFilters };
        if (updatedFilters[type].includes(value)) {
            updatedFilters[type] = updatedFilters[type].filter(
                (item) => item !== value
            );
        } else {
            updatedFilters[type].push(value);
        }
        setSelectedFilters(updatedFilters);
    };

    const handleConfirmFilters = () => {
        onConfirmFilters(selectedFilters);
        
        onHandleDropdown("department", false);
        onHandleDropdown("priority", false);
        onHandleDropdown("employee", false);
    };

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
                        <div className="items-container">
                            {departments.map((department) => (
                                <label
                                    key={department.id}
                                    className="dropdown-item"
                                >
                                    <input
                                        type="checkbox"
                                        id={`department-${department.id}`}
                                        name={`department-${department.id}`}
                                        checked={selectedFilters.department.includes(
                                            department.name
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "department",
                                                department.name
                                            )
                                        }
                                    />
                                    {department.name}
                                </label>
                            ))}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmFilters}
                        >
                            დადასტურება
                        </button>
                    </div>
                )}
                {dropdowns.priority && (
                    <div className="dropdown">
                        <div className="items-container">
                            {priorities.map((priority) => (
                                <label
                                    key={priority.id}
                                    className="dropdown-item"
                                >
                                    <input
                                        type="checkbox"
                                        id={`priority-${priority.id}`}
                                        name={`priority-${priority.id}`}
                                        checked={selectedFilters.priority.includes(
                                            priority.name
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "priority",
                                                priority.name
                                            )
                                        }
                                    />
                                    {priority.name}
                                </label>
                            ))}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmFilters}
                        >
                            დადასტურება
                        </button>
                    </div>
                )}
                {dropdowns.employee && (
                    <div className="dropdown">
                        <div className="items-container">
                            {employees.map((employee) => (
                                <label
                                    key={employee.id}
                                    className="dropdown-item"
                                >
                                    <input
                                        type="checkbox"
                                        id={`employee-${employee.id}`}
                                        name={`employee-${employee.id}`}
                                        checked={selectedFilters.employee.includes(
                                            employee.name
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "employee",
                                                employee.name
                                            )
                                        }
                                    />
                                    <img
                                        src={employee.avatar}
                                        alt={employee.name}
                                        className="employee-avatar"
                                    />
                                    {employee.name}
                                </label>
                            ))}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmFilters}
                        >
                            დადასტურება
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
