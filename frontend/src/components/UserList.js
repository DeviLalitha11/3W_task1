import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ onClaim, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("https://threewtask.onrender.com/api/users");
    setUsers(res.data);
  };

  const addUser = async () => {
    if (!newUser) return;
    await axios.post("https://threewtask.onrender.com/api/users", { name: newUser });
    setNewUser("");
    fetchUsers();
    onUpdate();
  };

  const claimPoints = async () => {
    if (!selectedUser) return;
    const res = await axios.post(`https://threewtask.onrender.com/api/users/${selectedUser}/claim`);
    onClaim(res.data);
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    await axios.delete(`https://threewtask.onrender.com/api/users/${userId}`);
    fetchUsers();
    onUpdate();
  };

  const handleSelect = (id) => {
    setSelectedUser(id);
    setDropdownOpen(false);
  };

  const selectedName = users.find((u) => u._id === selectedUser)?.name || "Select User";

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
          👥 User Management
        </h2>

        {/* Custom Dropdown */}
        <div className="relative mb-4 text-left">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {selectedName}
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
              {users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleSelect(user._id)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <button
            onClick={claimPoints}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 shadow-md transition"
          >
            Claim Points
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="New User"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={addUser}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 shadow-md transition"
          >
            Add
          </button>
        </div>

        {/* Delete user section */}
        <div className="text-left mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Delete Users</h3>
          <div className="max-h-40 overflow-y-auto pr-1">
            {users.map((user) => (
              <div key={user._id} className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
