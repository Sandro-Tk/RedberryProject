import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEY, API_URL } from "../App";
import "./TaskDetailsPage.css";

export default function TaskDetailsPage() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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

        fetchTask();
        fetchComments();
    }, [taskId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${API_URL}/tasks/${taskId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                    body: JSON.stringify({
                        text: newComment,
                        parent_id: taskId,
                    }),
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

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="task-details-page">
            <div className="task-header">
                <h1>{task.name}</h1>
                <p>{task.description}</p>
            </div>
            <div className="task-meta">
                <div className="task-meta-item">
                    <span className="meta-title">დეპარტამენტი:</span>
                    <span>{task.department.name}</span>
                </div>
                <div className="task-meta-item">
                    <span className="meta-title">პრიორიტეტი:</span>
                    <span>{task.priority.name}</span>
                </div>
                <div className="task-meta-item">
                    <span className="meta-title">თანამშრომელი:</span>
                    <div className="employee-info">
                        <img
                            src={task.employee.avatar}
                            alt={task.employee.name}
                            className="employee-avatar"
                        />
                        <span>{task.employee.name}</span>
                    </div>
                </div>
                <div className="task-meta-item">
                    <span className="meta-title">დასრულების ვადა:</span>
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
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
                            <span>{comment.author.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
