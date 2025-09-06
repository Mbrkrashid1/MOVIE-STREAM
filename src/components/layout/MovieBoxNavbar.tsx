
import { Video, User, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MovieBoxNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 shadow-lg">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo with Video Icon */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-white">
            HausaBox
          </div>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <User className="w-5 h-5 text-white" />
          </button>
          
          <Link to="/profile">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <Users className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieBoxNavbar;
