import React from "react";

export function Navbar({ onOpenModal }) {
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
                    <button className="add-task-btn">
                        add + png later შექმენი ახალი დავალება
                    </button>
                </div>
            </nav>
            <p className="subheader">დავალებების გვერდი</p>
        </>
    );
}
