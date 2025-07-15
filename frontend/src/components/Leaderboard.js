import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCrown } from "react-icons/fa";
import UserList from "./UserList";

const Leaderboard = ({ refresh, triggerRefresh }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get("https://threewtask.onrender.com/api/users/leaderboard/all");
      const data = res.data;

      // Calculate total pages based on new data
      const newTotalPages = Math.ceil((data.length - 3) / usersPerPage);

      // If current page > new total pages, go back one page
      if (currentPage > newTotalPages && newTotalPages >= 1) {
        setCurrentPage(newTotalPages);
      }

      setLeaderboard(data);
    };

    fetchLeaderboard();
  }, [refresh]); // Runs every time triggerRefresh is called


  const fetchLeaderboard = async () => {
    const res = await axios.get("https://threewtask.onrender.com/api/users/leaderboard/all");
    setLeaderboard(res.data);
  };

  const crownColors = ["text-yellow-400", "text-gray-400", "text-orange-400"];
  const podiumOrder = [1, 0, 2];
  const podiumHeights = ["mt-4", "-mt-8 scale-125", "mt-8"];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = leaderboard.slice(3).slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil((leaderboard.length - 3) / usersPerPage);

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-white min-h-screen px-4 py-8 flex flex-col gap-10 items-center md:flex-row md:items-start md:justify-center md:gap-12">
      {/* User Management Panel */}
      <div className="w-full md:w-1/3 flex justify-center mb-10 md:mb-0">
        <UserList onClaim={triggerRefresh} onUpdate={triggerRefresh} />
      </div>

      {/* Leaderboard Panel */}
      <div className="w-full md:w-2/3">
        <h1 className="text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-2 text-yellow-600">
          <FaCrown className="text-yellow-500 text-3xl" /> Leaderboard
        </h1>

        {/* Podium Section */}
        <div className="flex justify-center items-end gap-8 mb-12">
          {podiumOrder.map((rankIndex, displayIndex) => {
            const user = leaderboard[rankIndex];
            if (!user) return null;
            return (
              <div
                key={user._id}
                className={`flex flex-col items-center w-28 ${podiumHeights[displayIndex]} transition-all`}
              >
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl border-4 ${rankIndex === 0
                      ? "border-yellow-400"
                      : rankIndex === 1
                        ? "border-gray-400"
                        : "border-orange-400"
                    }`}
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${user._id}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 font-bold text-center text-md text-black">{user.name}</p>
                <p className="text-xs text-gray-500">{user.totalPoints} pts</p>
                <FaCrown className={`text-xl mt-1 ${crownColors[rankIndex]}`} />
              </div>
            );
          })}
        </div>

        {/* Leaderboard List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
          {currentUsers.map((user, index) => (
            <div
              key={user._id}
              className="flex items-center justify-between px-6 py-4 border-b last:border-none hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-semibold w-6 text-right">
                  {index + 4 + (currentPage - 1) * usersPerPage}.
                </span>
                <img
                  src={`https://i.pravatar.cc/100?u=${user._id}`}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover shadow"
                />
                <span className="text-gray-800 font-medium text-sm">{user.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{user.totalPoints} pts</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 bg-gray-300 text-sm rounded-md disabled:opacity-50 hover:bg-gray-400"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 bg-gray-300 text-sm rounded-md disabled:opacity-50 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
