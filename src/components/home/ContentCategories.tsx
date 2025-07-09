
const ContentCategories = () => {
  const categories = [
    { name: 'All', icon: '🎬', color: 'from-blue-600/20 to-purple-600/20' },
    { name: 'Hollywood', icon: '🎭', color: 'from-red-600/20 to-orange-600/20' },
    { name: 'Nollywood', icon: '🌟', color: 'from-green-600/20 to-teal-600/20' },
    { name: 'Anime', icon: '⚡', color: 'from-purple-600/20 to-pink-600/20' },
  ];

  return (
    <div className="px-4 mb-8">
      <h2 className="text-white text-lg font-semibold mb-4">Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`bg-gradient-to-br ${category.color} backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-105`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <h3 className="text-white font-semibold text-sm">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentCategories;
