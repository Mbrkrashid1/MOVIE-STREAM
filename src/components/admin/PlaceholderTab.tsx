
interface PlaceholderTabProps {
  title: string;
}

const PlaceholderTab = ({ title }: PlaceholderTabProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-400">This section is under development</p>
      </div>
    </div>
  );
};

export default PlaceholderTab;
