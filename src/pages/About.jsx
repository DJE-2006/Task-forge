import { Rocket, Shield, Zap, Globe, Heart, Code } from "lucide-react";

export default function About() {
  const features = [
    { icon: <Zap />, title: "Lightning Fast", desc: "Instant task updates and smooth interactions" },
    { icon: <Shield />, title: "Secure", desc: "Your data stays in your browser, always private" },
    { icon: <Globe />, title: "Accessible", desc: "Works on all devices, anywhere, anytime" },
    { icon: <Heart />, title: "Intuitive", desc: "Designed for ease of use and productivity" },
    { icon: <Code />, title: "Open Source", desc: "Built with modern, transparent technology" },
    { icon: <Rocket />, title: "Always Evolving", desc: "Regular updates with new features" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Rocket className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          About Task Flow
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          The ultimate productivity companion designed to streamline your workflow and 
          help you achieve more with less effort.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-6">
              <div className="text-indigo-600 dark:text-indigo-400">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-12 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate developers dedicated to creating tools that enhance productivity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Dhruv Jae", role: "Lead Developer", color: "from-blue-500 to-cyan-500" },
            { name: "Wincylle Heart", role: "UI/UX Designer", color: "from-purple-500 to-pink-500" },
            { name: "Dhruv Jae", role: "Product Manager", color: "from-orange-500 to-yellow-500" },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}