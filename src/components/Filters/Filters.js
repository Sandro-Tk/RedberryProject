import React, { useState, useEffect } from "react";
import "./Filters.css";

export default function Filters({
    dropdowns,
    filters,
    setFilters,
    departments,
    priorities,
    employees,
    onHandleDropdown,
    onConfirmFilters,
}) {
    const [tempFilters, setTempFilters] = useState(filters);

    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    const handleCheckboxChange = (type, value) => {
        const updatedFilters = { ...tempFilters };
        if (type === "employee") {
            if (updatedFilters[type].includes(value)) {
                updatedFilters[type] = updatedFilters[type].filter(
                    (item) => item !== value
                );
            } else {
                updatedFilters[type] = [value];
            }
        } else {
            if (updatedFilters[type].includes(value)) {
                updatedFilters[type] = updatedFilters[type].filter(
                    (item) => item !== value
                );
            } else {
                updatedFilters[type].push(value);
            }
        }
        setTempFilters(updatedFilters);
    };

    const handleConfirmFilters = () => {
        onConfirmFilters(tempFilters);
        setFilters(tempFilters); 
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
                        დეპარტამენტი{" "}
                        {dropdowns.department ? (
                            <img
                                className="filter-image"
                                src="icons/filter.png"
                                alt=""
                            />
                        ) : (
                            <img
                                className="filter-image"
                                src="icons/filteropen.png"
                                alt=""
                            />
                        )}
                    </button>
                </div>
                <div className="filter">
                    <button
                        className="filter-button"
                        onClick={() => onHandleDropdown("priority")}
                    >
                        პრიორიტეტი{" "}
                        {dropdowns.priority ? (
                            <img
                                className="filter-image"
                                src="icons/filter.png"
                                alt=""
                            />
                        ) : (
                            <img
                                className="filter-image"
                                src="icons/filteropen.png"
                                alt=""
                            />
                        )}
                    </button>
                </div>
                <div className="filter">
                    <button
                        className="filter-button"
                        onClick={() => onHandleDropdown("employee")}
                    >
                        თანამშრომელი{" "}
                        {dropdowns.employee ? (
                            <img
                                className="filter-image"
                                src="icons/filter.png"
                                alt=""
                            />
                        ) : (
                            <img
                                className="filter-image"
                                src="icons/filteropen.png"
                                alt=""
                            />
                        )}
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
                                    className="checkbox-container"
                                >
                                    <input
                                        type="checkbox"
                                        id={`department-${department.id}`}
                                        name={`department-${department.id}`}
                                        checked={tempFilters.department.includes(
                                            department.name
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "department",
                                                department.name
                                            )
                                        }
                                    />
                                    <span className="custom-checkbox"></span>
                                    {department.name}
                                </label>
                            ))}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmFilters}
                        >
                            არჩევა
                        </button>
                    </div>
                )}
                {dropdowns.priority && (
                    <div className="dropdown">
                        <div className="items-container">
                            {priorities.map((priority) => (
                                <label
                                    key={priority.id}
                                    className="checkbox-container"
                                >
                                    <input
                                        type="checkbox"
                                        id={`priority-${priority.id}`}
                                        name={`priority-${priority.id}`}
                                        checked={tempFilters.priority.includes(
                                            priority.name
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "priority",
                                                priority.name
                                            )
                                        }
                                    />
                                    <span className="custom-checkbox"></span>
                                    {priority.name}
                                </label>
                            ))}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmFilters}
                        >
                            არჩევა
                        </button>
                    </div>
                )}
                {dropdowns.employee && (
                    <div className="dropdown">
                        <div className="items-container">
                            {employees.map((employee) => (
                                <label
                                    key={employee.id}
                                    className="checkbox-container"
                                >
                                    <input
                                        type="checkbox"
                                        id={`employee-${employee.id}`}
                                        name="employee"
                                        checked={tempFilters.employee.includes(
                                            employee.id
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "employee",
                                                employee.id
                                            )
                                        }
                                    />
                                    <span className="custom-checkbox"></span>
                                    <img
                                        src={employee.avatar}
                                        alt={employee.name}
                                        className="employee-avatar"
                                    />
                                    {employee.name} {employee.surname}
                                </label>
                            ))}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmFilters}
                        >
                            არჩევა
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
