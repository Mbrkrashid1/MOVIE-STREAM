
import { useState } from "react";

const categories = [
  { id: 'trending', name: 'Trending', emoji: '🔥' },
  { id: 'buzzbox', name: '😊BuzzBox', emoji: '' },
  { id: 'nollywood', name: 'Nollywood', emoji: '' },
  { id: 'hollywood', name: 'Hollywood', emoji: '' },
  { id: 'music', name: 'Music', emoji: '' },
];

const CategoryTabs = () => {
  const [activeCategory, setActiveCategory] = useState('trending');

  return (
    <div className="flex px-4 space-x-6 mb-6 overflow-x-auto scrollbar-none w-full">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`font-medium pb-2 whitespace-nowrap transition-all duration-300 ${
            activeCategory === category.id
              ? 'text-white border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {category.emoji && <span className="mr-1">{category.emoji}</span>}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
