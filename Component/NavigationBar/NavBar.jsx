import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [localUser, setLocalUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("marco_user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("marco_user");
    setLocalUser(null);
    navigate("/login"); // Optional: redirect to login
  };

  return (
    <div className="flex border-b-[1px] py-4 px-2 lg:px-0 relative justify-between ">
      <h1 className="font-bold from-neutral-800 pt-2">
        Roots and robot project
      </h1>
      <div className="flex gap-5">
        {localUser && localUser.role !== "user" ? (
          <Link
            to="/setting"
            className="bg-white py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Einstellung
          </Link>
        ) : (
          ""
        )}

        {!localUser ? (
          <Link
            to="/login"
            className="bg-blue-600 py-2 px-3 border rounded-md text-white"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Hi {localUser.full_name}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
