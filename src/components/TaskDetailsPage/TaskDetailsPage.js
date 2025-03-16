import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEY, API_URL } from "../App";
import "./TaskDetailsPage.css";

export default function TaskDetailsPage() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [status, setStatus] = useState("");
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        async function fetchTask() {
            try {
                const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(
                        `Error fetching task: ${response.statusText}`
                    );
                }
                const taskData = await response.json();
                setTask(taskData);
                setStatus(taskData.status.id);
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        }

        async function fetchComments() {
            try {
                const response = await fetch(
                    `${API_URL}/tasks/${taskId}/comments`,
                    {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Error fetching comments: ${response.statusText}`
                    );
                }
                const commentsData = await response.json();
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }

        async function fetchStatuses() {
            try {
                const response = await fetch(`${API_URL}/statuses`, {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(
                        `Error fetching statuses: ${response.statusText}`
                    );
                }
                const statusesData = await response.json();
                setStatuses(statusesData);
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        }

        fetchTask();
        fetchComments();
        fetchStatuses();
    }, [taskId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const commentInfo = {
            text: newComment,
            task_id: taskId,
        };

        try {
            const response = await fetch(
                `${API_URL}/tasks/${taskId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                    body: JSON.stringify(commentInfo),
                }
            );
            if (!response.ok) {
                throw new Error(`Error adding comment: ${response.statusText}`);
            }
            const commentData = await response.json();
            setComments([...comments, commentData]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatusId = e.target.value;
        setStatus(newStatusId);
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({ ...task, status_id: newStatusId }),
            });
            if (!response.ok) {
                throw new Error(
                    `Error updating status: ${response.statusText}`
                );
            }
            const updatedTask = await response.json();
            setTask(updatedTask);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (!task) {
        return; //Maybe add a loading animation/spinner later
    }

    const priorityStyles = {
        დაბალი: { color: "#08A508", borderColor: "#08A508" },
        საშუალო: { color: "#FFBE0B", borderColor: "#FFBE0B" },
        მაღალი: { color: "#FA4D4D", borderColor: "#FA4D4D" },
    };

    return (
        <div className="task-details-page">
            <div className="task-info">
                <div className="priority-container">
                    <span
                        className="priority"
                        style={priorityStyles[task.priority.name]}
                    >
                        <img
                            className="priority-icon"
                            src={task.priority.icon}
                            alt="prio icon"
                        />
                        {task.priority.name}
                    </span>
                    <div className="department">{task.department.name}</div>
                </div>

                <span
                    style={{
                        fontSize: "34px",
                        fontWeight: 100,
                        fontFamily: "Inter",
                        marginTop: "12px",
                    }}
                >
                    {task.name}
                </span>
                <span
                    style={{
                        marginTop: "26px",
                        fontSize: "19px",
                        fontWeight: "400",
                        wordWrap: "break-word",
                    }}
                >
                    {task.description}
                </span>
            </div>
            <div className="task-details">
                <span
                    style={{
                        width: "273px",
                        height: "49px",
                        padding: "10px",
                        fontSize: "24px",
                        fontWeight: "500",
                    }}
                >
                    დავალების დეტალები
                </span>
                <div>
                    <div className="status">
                        <span>სტატუსი</span>
                        <select
                            value={task.status.id}
                            selected
                            onChange={handleStatusChange}
                        >
                            {statuses.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="employee">
                        <span>თანამშრომელი</span>
                        <span>
                            <img
                                src={task.employee.avatar}
                                alt={task.employee.name}
                                className="employee-avatar"
                            />
                            <span>
                                {task.employee.name} {task.employee.surname}
                            </span>
                        </span>
                    </div>
                    <div className="deadline">
                        <span className="meta-title">დასრულების ვადა:</span>
                        <span>
                            {new Date(task.due_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <div className="task-comments">
                <h2>კომენტარები ({comments.length})</h2>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="დაწერეთ კომენტარი"
                        required
                    />
                    <button type="submit">დამატება</button>
                </form>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p>{comment.text}</p>
                            <span>{comment.author_nickname}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
