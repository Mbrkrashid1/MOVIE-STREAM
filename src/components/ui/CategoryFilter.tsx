
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="w-full" orientation="horizontal">
      <div className="flex space-x-2 px-4 py-2 whitespace-nowrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`py-1 px-3 rounded-full text-sm ${
              activeCategory === category.id
                ? "bg-white text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CategoryFilter;
