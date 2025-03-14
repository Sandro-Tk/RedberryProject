import React from "react";
import "./Filters.css";

export default function Filters({
    dropdowns,
    filters,
    departments,
    priorities,
    employees,
    onHandleDropdown,
    onHandleCheckboxChange,
    onConfirmFilters,
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
                                    id={`department-${department.id}`}
                                    name={`department-${department.id}`}
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
                        <button
                            className="confirm-button"
                            onClick={onConfirmFilters}
                        >
                            დადასტურება
                        </button>
                    </div>
                )}
                {dropdowns.priority && (
                    <div className="dropdown">
                        {priorities.map((priority) => (
                            <label key={priority.id} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    id={`priority-${priority.id}`}
                                    name={`priority-${priority.id}`}
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
                        <button
                            className="confirm-button"
                            onClick={onConfirmFilters}
                        >
                            დადასტურება
                        </button>
                    </div>
                )}
                {dropdowns.employee && (
                    <div className="dropdown">
                        {employees.map((employee) => (
                            <label key={employee.id} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    id={`employee-${employee.id}`}
                                    name={`employee-${employee.id}`}
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
                        <button
                            className="confirm-button"
                            onClick={onConfirmFilters}
                        >
                            დადასტურება
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
