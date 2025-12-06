import TaskList from "../components/TaskList";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-12 px-4">
        <div className="inline-block mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-slow">
            <span className="text-white text-4xl">🚀</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Welcome to TaskForge
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          The <span className="font-semibold text-indigo-600 dark:text-indigo-400">ultimate productivity tool</span> designed to help you manage tasks efficiently and stay organized throughout your day.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full">
            <span className="text-green-700 dark:text-green-400 font-medium">✅ Auto-save tasks</span>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full">
            <span className="text-blue-700 dark:text-blue-400 font-medium">🌙 Dark mode</span>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full">
            <span className="text-purple-700 dark:text-purple-400 font-medium">📊 Dashboard analytics</span>
          </div>
        </div>
      </div>

      {/* Task List Container - Centered */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-2 border border-gray-200 dark:border-gray-700">
          <TaskList />
        </div>
      </div>

      {/* Quick Stats - Centered */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Start organizing your tasks today and experience the power of focused productivity.
        </p>
      </div>
    </div>
  );
}