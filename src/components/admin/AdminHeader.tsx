
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  return (
    <div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-white">
        Kanny<span className="text-kannyflix-green">Flix</span> Admin
      </h1>
      <Link to="/">
        <Button variant="outline" size="sm">Exit Admin</Button>
      </Link>
    </div>
  );
};

export default AdminHeader;
