import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks from API on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Unable to connect to server. Using local storage fallback.");
      // Fallback to localStorage
      const saved = localStorage.getItem("tasks");
      setTasks(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (input.trim() === "") return;
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input,
          description: "",
          priority: priority,
          completed: false,
        }),
      });
      if (!response.ok) throw new Error("Failed to add task");
      setInput("");
      await fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      // Fallback: add to localStorage
      const newTask = {
        id: Date.now(),
        title: input,
        description: "",
        completed: false,
        priority: priority,
        created_at: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
      setInput("");
    }
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      // Fallback: delete from local state
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      console.error("Error updating task:", err);
      // Fallback: update local state
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
    const taskTitle = task.title || task.text || "";
    const matchesSearch = taskTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      case "medium": return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case "low": return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      default: return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📝</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Task Manager
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Organize your tasks, set priorities, and track your progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-2">📋</div>
          <h3 className="text-2xl font-bold">{tasks.length}</h3>
          <p className="text-blue-100">Total Tasks</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-2xl font-bold">{completedTasks}</h3>
          <p className="text-green-100">Completed</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-2xl font-bold">{pendingTasks}</h3>
          <p className="text-orange-100">Pending</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="w-full px-6 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
                placeholder="What do you need to accomplish today?"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              
              <button
                onClick={addTask}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-xl">+</span>
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex items-center space-x-4 bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="bg-transparent border-0 focus:outline-none w-full"
            />
          </div>
          
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filter === f
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <span className="text-4xl">⏳</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your tasks...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">⚠️ {error}</p>
            <button
              onClick={fetchTasks}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-600 dark:text-gray-400">
              {search ? "No matching tasks found" : "Your task list is empty"}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {search ? "Try a different search term" : "Add your first task above to get started!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                  task.completed
                    ? "border-l-green-500"
                    : task.priority === "high"
                    ? "border-l-red-500"
                    : task.priority === "medium"
                    ? "border-l-yellow-500"
                    : "border-l-blue-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 dark:border-gray-600 hover:border-indigo-500"
                      }`}
                    >
                      {task.completed && <span className="text-white text-xl">✓</span>}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`text-lg font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                        {task.title || task.text}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {getPriorityEmoji(task.priority)} {task.priority} priority
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="mr-1">📅</span>
                          {new Date(task.created_at || task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeTask(task.id)}
                    className="ml-4 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You have completed <span className="font-bold text-green-600 dark:text-green-400">{completedTasks}</span> of{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{tasks.length}</span> tasks
              {pendingTasks > 0 && (
                <span className="ml-2">
                  (<span className="font-bold text-orange-600 dark:text-orange-400">{pendingTasks}</span> remaining)
                </span>
              )}
            </p>
            {completedTasks === tasks.length && tasks.length > 0 && (
              <p className="mt-2 text-green-600 dark:text-green-400 font-medium">
                🎉 All tasks completed! Great job!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
