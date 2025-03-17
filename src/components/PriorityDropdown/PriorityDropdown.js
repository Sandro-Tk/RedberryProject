import React, { useState, useRef, useEffect } from "react";
import "./PriorityDropdown.css";

export default function PriorityDropdown({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        onChange({ target: { value: option.id } });
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

    const selectedOption = options.find((option) => option.id === value);

    return (
        <div className="priority-dropdown" id='priority-dropdown' ref={dropdownRef}>
            <div className="priority-select" onClick={handleToggle}>
                {selectedOption ? (
                    <>
                        <img
                            src={selectedOption.icon}
                            alt={selectedOption.name}
                        />
                        {selectedOption.name}
                    </>
                ) : (
                    "Select Priority"
                )}
            </div>
            {isOpen && (
                <div className="priority-options">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={`priority-option ${
                                value === option.id ? "selected" : ""
                            }`}
                            onClick={() => handleOptionClick(option)}
                        >
                            <img src={option.icon} alt={option.name} />
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
