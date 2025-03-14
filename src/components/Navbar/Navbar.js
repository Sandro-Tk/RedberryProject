import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onOpenModal }) {
    const navigate = useNavigate();

    const handleAddTaskClick = () => {
        navigate("/add-task");
    };

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
