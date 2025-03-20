import React from "react";
import { useNavigate } from "react-router-dom";
import "./TaskBoard";

export default function TaskCard({ task, borderColor, departmentColor }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/task/${task.id}`);
    };

    const priorityClassMap = {
        დაბალი: "priority-low",
        საშუალო: "priority-medium",
        მაღალი: "priority-high",
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("ka-GE", options).format(
            date
        );
        const [month, day, year] = formattedDate.replace(",", "").split(" ");
        const monthMap = {
            Jan: "იან",
            Feb: "თებ",
            Mar: "მარ",
            Apr: "აპრ",
            May: "მაი",
            Jun: "ივნ",
            Jul: "ივლ",
            Aug: "აგვ",
            Sep: "სექ",
            Oct: "ოქტ",
            Nov: "ნოე",
            Dec: "დეკ",
        };

        return `${day} ${monthMap[month]} , ${year}`;
    };

    const truncateDescription = (description) => {
        if (!description) {
            return "";
        }
        if (description.length > 100) {
            return description.substring(0, 100) + "...";
        }
        return description;
    };

    return (
        <div
            className="task-card"
            style={{ borderColor }}
            onClick={handleClick}
        >
            <div className="task-header">
                <span
                    className={`tag priority ${
                        priorityClassMap[task.priority.name]
                    }`}
                >
                    <img src={task.priority.icon} alt={task.priority.name} />
                    {task.priority.name}
                </span>
                <span
                    className="tag department"
                    style={{ backgroundColor: departmentColor }}
                >
                    {task.department.name}
                </span>
                <span className="due-date">{formatDate(task.due_date)}</span>
            </div>
            <p className="task-name">{task.name}</p>
            <span className="task-description">
                {truncateDescription(task.description)}
            </span>
            <div className="task-footer">
                <img
                    src={task.employee.avatar}
                    alt="User"
                    className="user-avatar"
                />
                <span className="comments">
                    <img src="icons/comments.png" alt="" />{" "}
                    {task.total_comments}
                </span>
            </div>
        </div>
    );
}
