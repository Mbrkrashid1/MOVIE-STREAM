
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  onSelectCategory: (id: string) => void;
}

const CategoryFilter = ({ categories, onSelectCategory }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex space-x-4 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`whitespace-nowrap py-2 px-1 text-sm ${
              activeCategory === category.id
                ? "category-active"
                : "text-gray-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
