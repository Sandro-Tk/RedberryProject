import React, { useState, useEffect, useCallback } from "react";
import { API_URL, API_KEY } from "../App";
import "./Modal.css";

export default function Modal({ isOpen, onClose, departments, addEmployee }) {
    const [name, setName] = useState("");
    const [surname, setLastname] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [avatar, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [nameError, setNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [nameMaxError, setNameMaxError] = useState("");
    const [surnameMaxError, setSurnameMaxError] = useState("");

    const validateInput = (value, setError, setMaxError, inputId) => {
        const inputElement = document.getElementById(inputId);
        if (value.length === 0) {
            setError("");
            setMaxError("");
            inputElement.style.border = "1px solid #dee2e6";
        } else if (value.length < 2) {
            setError("მინიმუმ 2 სიმბოლო");
            setMaxError("");
            inputElement.style.border = "1px solid #FA4D4D";
        } else if (value.length > 255) {
            setMaxError("მაქსიმუმ 255 სიმბოლო");
            setError("valid");
            inputElement.style.border = "1px solid #FA4D4D";
        } else if (!/^[a-zA-Zა-ჰ]*$/.test(value)) {
            setError("მხოლოდ ლათინური და ქართული ასოები");
            setMaxError("");
            inputElement.style.border = "1px solid #FA4D4D";
        } else {
            setError("valid");
            setMaxError("valid");
            inputElement.style.border = "1px solid #dee2e6";
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        validateInput(value, setNameError, setNameMaxError, "name");
    };

    const handleLastnameChange = (e) => {
        const value = e.target.value;
        setLastname(value);
        validateInput(value, setSurnameError, setSurnameMaxError, "lastname");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 600 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Image size should be less than 600KB");
        }
    };

    const handleImageRemove = () => {
        setImage(null);
        setImagePreview(null);
        document.getElementById("photo").value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("department_id", departmentId);
        formData.append("avatar", avatar);

        try {
            const response = await fetch(
                `${API_URL}/employees`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                    },
                    body: formData,
                },
                []
            );

            if (response.ok) {
                const newEmployee = await response.json();
                addEmployee(newEmployee);
                handleClose();
            } else {
                const errorText = await response.text();
                console.error("Failed to create employee:", errorText);
                alert("Failed to create employee.");
            }
        } catch (error) {
            console.error("Error creating employee:", error);
            alert("An error occurred while creating the employee.");
        }
    };

    const handleClose = useCallback(() => {
        setName("");
        setLastname("");
        setDepartmentId("");
        setImage(null);
        setImagePreview(null);
        setNameError("");
        setSurnameError("");
        setNameMaxError("");
        setSurnameMaxError("");
        onClose();
    }, [onClose]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [handleClose]);

    useEffect(() => {
        if (!isOpen) {
            handleClose();
        }
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="forms">
                    <span className="modal-title">თანამშრომლის დამატება</span>
                    <div className="forms-container">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-row1">
                                <div className="form-group">
                                    <label htmlFor="name">სახელი*</label>
                                    <input
                                        style={{ border: "1px solid #dee2e6" }}
                                        type="text"
                                        id="name"
                                        name="name"
                                        minLength="2"
                                        maxLength="255"
                                        pattern="[a-zA-Zა-ჰ]*"
                                        value={name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                    <small
                                        className={
                                            nameError === ""
                                                ? "gray"
                                                : nameError === "valid"
                                                ? "valid"
                                                : "error"
                                        }
                                    >
                                        <img src="icons/checkmark.png" alt="" />
                                        მინიმუმ 2 სიმბოლო
                                    </small>
                                    <small
                                        className={
                                            nameMaxError === ""
                                                ? "gray"
                                                : nameMaxError === "valid"
                                                ? "valid"
                                                : "error"
                                        }
                                    >
                                        <img src="icons/checkmark.png" alt="" />
                                        მაქსიმუმ 255 სიმბოლო
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">გვარი*</label>
                                    <input
                                        style={{ border: "1px solid #dee2e6" }}
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        minLength="2"
                                        maxLength="255"
                                        pattern="[a-zA-Zა-ჰ]*"
                                        value={surname}
                                        onChange={handleLastnameChange}
                                        required
                                    />
                                    <small
                                        className={
                                            surnameError === ""
                                                ? "gray"
                                                : surnameError === "valid"
                                                ? "valid"
                                                : "error"
                                        }
                                    >
                                        <img src="icons/checkmark.png" alt="" />
                                        მინიმუმ 2 სიმბოლო
                                    </small>
                                    <small
                                        className={
                                            surnameMaxError === ""
                                                ? "gray"
                                                : surnameMaxError === "valid"
                                                ? "valid"
                                                : "error"
                                        }
                                    >
                                        <img src="icons/checkmark.png" alt="" />
                                        მაქსიმუმ 255 სიმბოლო
                                    </small>
                                </div>
                            </div>
                            <div className="form-row2">
                                <label htmlFor="photo">ავატარი*</label>
                                <div className="upload-photo">
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                        required
                                        placeholder={
                                            <img src="icons/photo.png" alt="" />
                                        }
                                    />
                                    <label
                                        htmlFor="photo"
                                        className="upload-photo-label"
                                    >
                                        {imagePreview ? (
                                            <div className="image-preview-container">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="image-preview"
                                                />
                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    onClick={handleImageRemove}
                                                >
                                                    <img
                                                        src="icons/delete.png"
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                        ) : (
                                            "ატვირთეთ ფოტო"
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="form-row3">
                                <label htmlFor="department">
                                    დეპარტამენტი*
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    value={departmentId}
                                    onChange={(e) =>
                                        setDepartmentId(e.target.value)
                                    }
                                    required
                                >
                                    <option value="" disabled>
                                        
                                    </option>
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={handleClose}>
                                    გაუქმება
                                </button>
                                <button type="submit">
                                    დაამატე თანამშრომელი
                                </button>
                            </div>
                        </form>
                    </div>
                    <button className="close-button" onClick={handleClose}>
                        <img
                            style={{ cursor: "pointer" }}
                            src="icons/close.png"
                            alt=""
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
