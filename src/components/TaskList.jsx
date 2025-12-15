import { useState, useEffect } from "react";

const API_URL = '/api';

const apiPath = (path) => {
  const base = (API_URL || '').replace(/\/$/, '');
  const p = (path || '').replace(/^\//, '');
  return `${base}/${p}`;
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(apiPath('/tasks'));
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Unable to connect to server. Using local storage fallback.");
      const saved = localStorage.getItem("tasks");
      setTasks(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (input.trim() === "") return;
    try {
      const response = await fetch(apiPath('/tasks'), {
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
      setPriority("medium"); // Reset priority after adding
      await fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
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
      setPriority("medium"); // Reset priority after adding
    }
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch(apiPath(`/tasks/${id}`), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const response = await fetch(apiPath(`/tasks/${id}`), {
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
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-indigo-500 text-white";
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
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📝</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Task Manager
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Organize your tasks, set priorities, and track your progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105">
          <div className="text-4xl mb-2">📋</div>
          <h3 className="text-2xl font-bold">{tasks.length}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium">Total Tasks</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-2xl font-bold">{completedTasks}</h3>
          <p className="text-green-600 dark:text-green-400 font-medium">Completed</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-2xl font-bold">{pendingTasks}</h3>
          <p className="text-orange-600 dark:text-orange-400 font-medium">Pending</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white text-lg shadow-sm transition-all"
                placeholder="What do you need to accomplish today?"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white font-medium transition-all"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              
              <button
                onClick={addTask}
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
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
          <div className="w-full md:w-auto flex items-center space-x-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="bg-transparent border-0 focus:outline-none w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-300 dark:border-gray-700">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  filter === f
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6 text-center">
            <p className="text-amber-900 dark:text-amber-200 font-medium">⚠️ {error}</p>
            <button
              onClick={fetchTasks}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {search ? "No matching tasks found" : "Your task list is empty"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search ? "Try a different search term" : "Add your first task above to get started!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${
                  task.completed
                    ? "border-l-green-500 opacity-75"
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
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400"
                      }`}
                    >
                      {task.completed && <span className="text-white text-xl">✓</span>}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg font-medium break-words ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
                        {task.title || task.text}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                          {getPriorityEmoji(task.priority)} {task.priority || 'medium'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-shrink-0">
                          <span className="mr-1">📅</span>
                          {new Date(task.created_at || task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeTask(task.id)}
                    className="ml-4 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 flex-shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700 text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              You have completed <span className="font-bold text-green-600 dark:text-green-400">{completedTasks}</span> of{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{tasks.length}</span> tasks
              {pendingTasks > 0 && (
                <span className="ml-2">
                  (<span className="font-bold text-orange-600 dark:text-orange-400">{pendingTasks}</span> remaining)
                </span>
              )}
            </p>
            {completedTasks === tasks.length && tasks.length > 0 && (
              <p className="mt-2 text-green-600 dark:text-green-400 font-bold text-lg">
                🎉 All tasks completed! Great job!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
