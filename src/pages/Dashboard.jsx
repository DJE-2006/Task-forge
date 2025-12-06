import { BarChart3, TrendingUp, Users, Target } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Tasks Completed", value: "128", change: "+12%", icon: <BarChart3 />, color: "blue" },
    { label: "Productivity", value: "84%", change: "+8%", icon: <TrendingUp />, color: "green" },
    { label: "Team Members", value: "12", change: "+2", icon: <Users />, color: "purple" },
    { label: "Goals Achieved", value: "7/10", change: "+3", icon: <Target />, color: "orange" },
  ];

  const recentActivities = [
    { user: "You", action: "completed", task: "Design Review", time: "2 min ago" },
    { user: "Alex", action: "added", task: "New Feature", time: "15 min ago" },
    { user: "Sarah", action: "updated", task: "Project Timeline", time: "1 hour ago" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center`}>
                <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.icon}
                </div>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    <span className="text-gray-900 dark:text-white">{activity.user}</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{" "}
                    <span className="text-gray-900 dark:text-white">{activity.task}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Tips */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Productivity Tips</h2>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white font-medium mb-2">Focus on one task at a time</p>
              <p className="text-white/80 text-sm">Multitasking reduces productivity by up to 40%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white font-medium mb-2">Take regular breaks</p>
              <p className="text-white/80 text-sm">Try the Pomodoro technique: 25 mins work, 5 mins break</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white font-medium mb-2">Prioritize your tasks</p>
              <p className="text-white/80 text-sm">Use Eisenhower Matrix for better task management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}