import React, { useContext, useState, useEffect } from "react";
import logo2 from "../assets/pn1.png";
import { FaSearch, FaHome } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import dp from "../assets/dp.jpg";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false);
  let { userData, setUserData, handleGetProfile } =
    useContext(userDataContext);

  let [showPopup, setShowPopup] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);

  let [searchInput, setSearchInput] = useState("");
  let [searchData, setSearchData] = useState([]);

  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${searchInput}`,
        { withCredentials: true }
      );
      setSearchData(result.data);
    } catch (error) {
      setSearchData([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchInput]);

  return (
    <div className="w-full h-[70px] bg-white dark:bg-[#1f2937] fixed top-0 left-0 shadow-sm flex items-center justify-center px-6 z-50">

      {/* INNER CONTAINER */}
      <div className="w-full max-w-[1400px] flex items-center">

        {/* LEFT LOGO */}
        <div className="w-[23%] flex items-center">
          <img
            src={logo2}
            className="w-[150px] cursor-pointer"
            onClick={() => {
              setActiveSearch(false);
              navigate("/");
            }}
          />
        </div>

        {/* CENTER SEARCH */}
        <div className="w-[50%] flex justify-center relative">
          <div className="w-full max-w-[500px] flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-white"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
          </div>

          {/* SEARCH RESULTS */}
          {searchData.length > 0 && (
            <div className="absolute top-[60px] w-full max-w-[500px] bg-white dark:bg-[#1f2937] rounded-xl shadow-lg p-3 max-h-[400px] overflow-y-auto z-50">
              {searchData.map((sea) => (
                <div
                  key={sea._id}
                  onClick={() => handleGetProfile(sea.userName)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <img
                    src={sea.profileImage || dp}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white">
                      {sea.firstName} {sea.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sea.headline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT MENU */}
        <div className="w-[27%] flex justify-end items-center gap-6 text-gray-600 dark:text-gray-200">

          <div
            className="flex flex-col items-center cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/")}
          >
            <FaHome />
            <span className="text-xs">Home</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/network")}
          >
            <FaUserGroup />
            <span className="text-xs">Network</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/notification")}
          >
            <IoNotificationsSharp />
            <span className="text-xs">Notify</span>
          </div>

          {/* PROFILE */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setShowPopup((prev) => !prev)}
          >
            <img
              src={userData.profileImage || dp}
              className="w-full h-full object-cover"
            />
          </div>

          {/* POPUP */}
          {showPopup && (
            <div className="absolute top-[70px] right-[40px] w-[260px] bg-white dark:bg-[#1f2937] rounded-xl shadow-lg p-4 flex flex-col items-center gap-3">
              <img
                src={userData.profileImage || dp}
                className="w-16 h-16 rounded-full"
              />
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {userData.firstName} {userData.lastName}
              </div>

              <button
                className="w-full py-2 border border-blue-400 text-blue-500 rounded-full"
                onClick={() => handleGetProfile(userData.userName)}
              >
                View Profile
              </button>

              <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-600"></div>

              <button
                className="w-full py-2 border border-red-400 text-red-500 rounded-full"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;