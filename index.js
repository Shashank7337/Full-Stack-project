<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Manager Dashboard</title>
    <style>
        body { font-family: Arial; margin: 40px; background: #f4f4f4; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px; }
        input, select, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
        button { background: #5d3fd3; color: white; border: none; cursor: pointer; }
        .stats { display: flex; gap: 20px; }
        .stat-box { flex: 1; padding: 20px; background: #5d3fd3; color: white; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <h1>🚀 Project Management Dashboard</h1>

    <!-- Dashboard Stats -->
    <div class="stats card">
        <div class="stat-box"><h3>Total Tasks</h3><p id="total-tasks">0</p></div>
        <div class="stat-box"><h3>Pending</h3><p id="pending-tasks">0</p></div>
        <div class="stat-box"><h3>Completed</h3><p id="completed-tasks">0</p></div>
    </div>

    <!-- Task Creation (Admin Only Logic) -->
    <div class="card">
        <h3>Create New Task (Admin)</h3>
        <input type="text" id="task-title" placeholder="Task Name">
        <select id="task-status">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
        </select>
        <button onclick="createTask()">Add Task</button>
    </div>

    <div class="card">
        <h3>Task List</h3>
        <ul id="task-list"></ul>
    </div>

    <script>
        const API_URL = window.location.origin;

        async function fetchDashboard() {
            const res = await fetch(`${API_URL}/dashboard`);
            const data = await res.json();
           
            document.getElementById('total-tasks').innerText = data.length || 0;
        }

        async function createTask() {
            const title = document.getElementById('task-title').value;
            const status = document.getElementById('task-status').value;
            
            await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, status, admin_email: 'shashank@test.com' })
            });
            alert('Task Created!');
            location.reload();
        }

        fetchDashboard();
    </script>
</body>
</html>
