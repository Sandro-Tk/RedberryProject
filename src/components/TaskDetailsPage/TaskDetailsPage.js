import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEY, API_URL } from "../App";
import "./TaskDetailsPage.css";

export default function TaskDetailsPage() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newSubComment, setNewSubComment] = useState("");
    const [, setStatus] = useState("");
    const [statuses, setStatuses] = useState([]);
    const [replyToCommentId, setReplyToCommentId] = useState(null);

    const departmentColors = {
        1: "#89B6FF",
        2: "#FD9A6A",
        3: "#FF66A8",
        4: "#FFD86D",
        5: "#89B6FF",
        6: "#FD9A6A",
        7: "#FF66A8",
    };

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

    const handleSubCommentChange = (e) => {
        setNewSubComment(e.target.value);
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

    const handleSubCommentSubmit = async (e, commentId) => {
        e.preventDefault();

        const subCommentInfo = {
            text: newSubComment,
            parent_id: commentId,
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
                    body: JSON.stringify(subCommentInfo),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Error adding subcomment: ${response.statusText}`
                );
            }
            const subCommentData = await response.json();
            setComments(
                comments.map((comment) =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              sub_comments: [
                                  ...(comment.sub_comments || []),
                                  subCommentData,
                              ],
                          }
                        : comment
                )
            );
            setNewSubComment("");
            setReplyToCommentId(null);
        } catch (error) {
            console.error("Error adding subcomment:", error);
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

    const toggleReplyToCommentId = (commentId) => {
        setReplyToCommentId((prevId) =>
            prevId === commentId ? null : commentId
        );
    };

    const getTotalCommentsCount = () => {
        let count = comments.length;
        comments.forEach((comment) => {
            if (comment.sub_comments) {
                count += comment.sub_comments.length;
            }
        });
        return count;
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
            <div className="form-left">
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
                        <div
                            className="department"
                            style={{
                                backgroundColor:
                                    departmentColors[task.department.id],
                            }}
                        >
                            {task.department.name}
                        </div>
                    </div>

                    <span
                        style={{
                            fontSize: "34px",
                            fontWeight: "600",
                            marginTop: "12px",
                            color: "#212529",
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
                            fontSize: "24px",
                            fontWeight: "500",
                        }}
                    >
                        დავალების დეტალები
                    </span>
                    <div>
                        <div className="status">
                            <span className="span-style">
                                <img
                                    className="icons"
                                    src="../icons/status.png"
                                    alt=""
                                />
                                სტატუსი
                            </span>
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
                            <span className="span-style">
                                <img
                                    className="icons"
                                    src="../icons/employee.png"
                                    alt=""
                                />
                                თანამშრომელი
                            </span>
                            <span
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginLeft: "30px",
                                }}
                            >
                                <img
                                    src={task.employee.avatar}
                                    alt={task.employee.name}
                                    className="employee-avatar"
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "5px",
                                        width: "max-content",
                                    }}
                                >
                                    <span style={{ fontSize: "12px" }}>
                                        {task.employee.department.name}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "#0D0F10",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {task.employee.name}{" "}
                                        {task.employee.surname}
                                    </span>
                                </div>
                            </span>
                        </div>
                        <div className="deadline">
                            <span className="span-style">
                                <img
                                    className="icons"
                                    src="../icons/deadline.png"
                                    alt=""
                                />
                                დასრულების ვადა:
                            </span>
                            <span>
                                {new Date(task.due_date)
                                    .toLocaleDateString("ka-GE", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    .replace(/,/, " -")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="task-comments">
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <div className="comment-input-container">
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="დაწერე კომენტარი"
                            required
                        />
                        <button className="comment-button" type="submit">
                            დააკომენტარე
                        </button>
                    </div>
                </form>
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    კომენტარები{" "}
                    <span className="comments-length">
                        {getTotalCommentsCount()}
                    </span>
                </div>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <div className="comment-info">
                                <img src={comment.author_avatar} alt="avatar" />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <span>{comment.author_nickname}</span>
                                    <p>{comment.text}</p>
                                    {(!comment.sub_comments ||
                                        comment.sub_comments.length === 0) && (
                                        <button
                                            className="subcomment-button"
                                            onClick={() =>
                                                toggleReplyToCommentId(
                                                    comment.id
                                                )
                                            }
                                        >
                                            <img
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    marginRight: "4px",
                                                }}
                                                src="../icons/subcomment.png"
                                                alt=""
                                            />
                                            უპასუხე
                                        </button>
                                    )}
                                    {replyToCommentId === comment.id && (
                                        <form
                                            onSubmit={(e) =>
                                                handleSubCommentSubmit(
                                                    e,
                                                    comment.id
                                                )
                                            }
                                            className="subcomment-form"
                                        >
                                            <div className="subcomment-info-container">
                                                <textarea
                                                    value={newSubComment}
                                                    onChange={
                                                        handleSubCommentChange
                                                    }
                                                    placeholder="დაწერე პასუხი"
                                                    required
                                                />
                                                <button
                                                    className="submit-subcomment"
                                                    type="submit"
                                                >
                                                    დამატება
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                    {comment.sub_comments && (
                                        <ul
                                            className="subcomment-list"
                                            style={{
                                                height:
                                                    comment.sub_comments
                                                        .length === 0
                                                        ? "0"
                                                        : "50px",
                                            }}
                                        >
                                            {comment.sub_comments.map(
                                                (subComment) => (
                                                    <li key={subComment.id}>
                                                        <div className="subcomment-info">
                                                            <img
                                                                src={
                                                                    subComment.author_avatar
                                                                }
                                                                alt="avatar"
                                                            />
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                }}
                                                            >
                                                                <span>
                                                                    {
                                                                        subComment.author_nickname
                                                                    }
                                                                </span>
                                                                <p>
                                                                    {
                                                                        subComment.text
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
