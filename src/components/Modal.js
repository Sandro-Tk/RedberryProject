import React, { useState, useEffect } from "react";
import { API_URL, API_KEY } from "./App";

export function Modal({ isOpen, onClose, departments, addEmployee }) {
    const [name, setName] = useState("");
    const [surname, setLastname] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [avatar, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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

        // creating a formdata object to add the avatar
        const formData = new FormData();
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("department_id", departmentId);
        formData.append("avatar", avatar);

        try {
            const response = await fetch(`${API_URL}/employees`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newEmployee = await response.json();
                addEmployee(newEmployee);
                alert("Employee created successfully!");
                onClose();
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

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="forms">
                    <h2>თანამშრომლის დამატება</h2>
                    <div className="forms-container">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">სახელი*</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        minLength="2"
                                        maxLength="255"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">გვარი*</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        minLength="2"
                                        maxLength="255"
                                        value={surname}
                                        onChange={(e) =>
                                            setLastname(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
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
                                                    🗑️
                                                </button>
                                            </div>
                                        ) : (
                                            "ატვირთეთ ფოტო"
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
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
                                    <option value="">
                                        აირჩიეთ დეპარტამენტი
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
                                <button type="button" onClick={onClose}>
                                    დახურვა
                                </button>
                                <button type="submit">შენახვა</button>
                            </div>
                        </form>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}
