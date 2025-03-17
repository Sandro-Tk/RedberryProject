import React, { useState, useRef, useEffect } from "react";
import "./EmployeeDropdown.css";

export default function EmployeeDropdown({ employees, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (employee) => {
        onChange({ target: { value: employee.id } });
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedEmployee = employees.find(
        (employee) => employee.id === value
    );

    return (
        <div className="employee-dropdown" ref={dropdownRef}>
            <div className="employee-select" onClick={handleToggle}>
                {selectedEmployee ? (
                    <>
                        <img
                            src={selectedEmployee.avatar}
                            alt={selectedEmployee.name}
                            className="employee-avatar"
                        />
                        {selectedEmployee.name} {selectedEmployee.surname}
                    </>
                ) : (
                    "აირჩიეთ თანამშრომელი"
                )}
            </div>
            {isOpen && (
                <div className="employee-options">
                    {employees.map((employee) => (
                        <div
                            key={employee.id}
                            className={`employee-option ${
                                value === employee.id ? "selected" : ""
                            }`}
                            onClick={() => handleOptionClick(employee)}
                        >
                            <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="employee-avatar"
                            />
                            {employee.name} {employee.surname}
                        </div>
                    ))}
                </div>
            )}
            <input type="hidden" name="assignee" value={value} required />
        </div>
    );
}
