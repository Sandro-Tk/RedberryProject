export default function App() {
    return (
        <div>
            <Navbar />
            <Filters />
            <TaskBoard />
        </div>
    );
}

function Navbar() {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <span className="logo">Momentum</span>
                </div>
                <div className="navbar-right">
                    <button className="add-employee-button">
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

function Filters() {
    return (
        <div className="filters">
            <button>დეპარტამენტი</button>
            <button>პრიორიტეტი</button>
            <button>თანამშრომელი</button>
        </div>
    );
}

function TaskBoard() {
    const tasks = [
        {
            id: 1,
            title: "Redberry-ს ბანერის დიზაინი",
            description: "შექმენი ახალი დიზაინი",
            priority: "High",
            status: "დასაწყები",
            userAvatar: "/avatar1.png",
            comments: 8,
        },
        {
            id: 2,
            title: "Mobile UI Fix",
            description: "შექმენი ახალი დიზაინი",
            priority: "Medium",
            status: "პროცესში",
            userAvatar: "/avatar2.png",
            comments: 5,
        },
        {
            id: 3,
            title: "New Landing Page",
            description: "შექმენი ახალი დიზაინი",
            priority: "Low",
            status: "მიმდინარეობს",
            userAvatar: "/avatar3.png",
            comments: 3,
        },
    ];

    const columns = [
        { title: "დასაწყები", color: "##F7BC30" },
        { title: "პროგრესში", color: "##FB5607" },
        { title: "მზად ტესტირებისთვის", color: "##FF006E" },
        { title: "დასრულებული", color: "##3A86FF" },
    ];

    return (
        <div className="task-board">
            {columns.map((column) => (
                <TaskColumn
                    key={column.title}
                    title={column.title}
                    color={column.color}
                    tasks={tasks.filter((task) => task.status === column.title)}
                />
            ))}
        </div>
    );
}

function TaskCard({ task }) {
    return (
        <div className="task-card">
            <div className="task-header">
                <span className={`tag ${task.priority.toLowerCase()}`}>
                    {task.priority}
                </span>
                <span className={`tag ${task.status.toLowerCase()}`}>
                    {task.status}
                </span>
            </div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="task-footer">
                <img src={task.userAvatar} alt="User" className="user-avatar" />
                <span className="comments">💬 {task.comments}</span>
            </div>
        </div>
    );
}

function TaskColumn({ title, tasks, color }) {
    return (
        <div className="task-column">
            <h3 className="column-title" style={{ backgroundColor: color }}>
                {title}
            </h3>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}
