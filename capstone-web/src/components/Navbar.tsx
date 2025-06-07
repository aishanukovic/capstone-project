import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { logout } = useAuth0();

  return (
    <nav className="bg-[#f7f7f7] text-gray-700 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/dashboard" className="text-xl font-bold tracking-wide">
          <img
            src="/logo.png"
            alt="Naturopathia Logo"
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 w-full sm:w-auto">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/search" className="hover:underline">Virtual AI Naturopath</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="bg-purple-600 hover:bg-purple-800 text-white px-3 py-1 rounded text-sm sm:text-base w-24 sm:w-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;