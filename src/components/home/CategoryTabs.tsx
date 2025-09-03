
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
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex space-x-8 py-4 overflow-x-auto scrollbar-none border-b border-streaming-border/20">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`font-medium pb-3 whitespace-nowrap transition-all duration-300 relative ${
              activeCategory === category.id
                ? 'text-streaming-text'
                : 'text-streaming-muted hover:text-streaming-text'
            }`}
          >
            {category.emoji && <span className="mr-2">{category.emoji}</span>}
            {category.name}
            {activeCategory === category.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
