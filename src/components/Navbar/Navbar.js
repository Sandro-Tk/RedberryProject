import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onOpenModal }) {
    const navigate = useNavigate();

    const handleAddTaskClick = () => {
        navigate("/add-task");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left" style={{ cursor: "pointer" }}>
                    <span className="nav-title" onClick={handleLogoClick}>
                        Momentum
                    </span>
                    <img
                        src="icons/Hourglass.png"
                        alt=""
                        className="nav-icon"
                        onClick={handleLogoClick}
                    />
                </div>
                <div className="navbar-right">
                    <button
                        className="add-employee-button"
                        onClick={onOpenModal}
                    >
                        თანამშრომლის შექმნა
                    </button>
                    <button
                        className="add-task-btn"
                        onClick={handleAddTaskClick}
                    >
                        შექმენი ახალი დავალება
                    </button>
                </div>
            </nav>
        </>
    );
}
