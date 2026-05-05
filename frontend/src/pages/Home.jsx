import React, { useState, useRef, useContext, useEffect } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.jpg";
import { FaCamera } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import { RxCross1 } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa6";
import EditProfile from "../components/EditProfile";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import Post from "../components/Post";

function Home() {
  let { userData, edit, setEdit, postData, getPost, handleGetProfile } =
    useContext(userDataContext);

  let { serverUrl } = useContext(authDataContext);

  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [uploadPost, setUploadPost] = useState(false);
  let image = useRef();
  let [posting, setPosting] = useState(false);
  let [suggestUsers, setSuggestUsers] = useState([]);

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  async function handleUploadpost() {
    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) formdata.append("image", backendImage);

      await axios.post(serverUrl + "/api/post/create", formdata, {
        withCredentials: true,
      });

      setPosting(false);
      setUploadPost(false);
      getPost();
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(
        serverUrl + "/api/user/suggestedusers",
        { withCredentials: true }
      );
      setSuggestUsers(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSuggestedUsers();
  }, []);

  useEffect(() => {
    getPost();
  }, [uploadPost]);

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] pt-[90px] px-6 flex justify-center gap-6">
      {edit && <EditProfile />}
      <Nav />

      {/* LEFT SIDEBAR */}
      <div className="w-[23%] bg-white rounded-2xl shadow-md flex flex-col gap-4 sticky top-[100px] h-fit relative pb-4">

        {/* Cover */}
        <div
          className="w-full h-[110px] bg-gradient-to-r from-blue-400 to-cyan-300 rounded-t-2xl relative cursor-pointer overflow-hidden"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.coverImage || ""}
            alt=""
            className="w-full h-full object-cover"
          />
          <FaCamera className="absolute right-3 top-3 text-white" />
        </div>

        {/* ✅ PROFILE IMAGE (FIXED) */}
        <div
          className="absolute top-[70px] left-5 w-[90px] h-[90px] rounded-full border-4 border-white shadow-md overflow-hidden bg-white cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.profileImage || dp}
            alt="dp"
            className="w-full h-full object-cover"
          />
        </div>

        {/* USER INFO */}
        <div className="mt-[60px] px-4">
          <div className="text-lg font-semibold text-gray-800">
            {userData.firstName} {userData.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {userData.headline || ""}
          </div>
          <div className="text-xs text-gray-400">
            {userData.location}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="px-4 flex flex-col gap-3">
          <button
            onClick={() => setEdit(true)}
            className="w-full h-[42px] rounded-full border border-blue-400 text-blue-500 font-medium hover:bg-blue-50 transition"
          >
            Edit Profile
          </button>

          <button
            onClick={() =>
              window.open(
                "https://resumeanalyzer-7-b7krfk.puter.site/",
                "_blank"
              )
            }
            className="w-full h-[42px] rounded-full border border-blue-400 text-blue-500 font-medium hover:bg-blue-50 transition"
          >
            AI Resume Analyzer
          </button>

          <button
            onClick={() =>
              (window.location.href = `${serverUrl}/api/user/go-to-clubs`)
            }
            className="w-full h-[42px] rounded-full border border-blue-400 text-blue-500 font-medium hover:bg-blue-50 transition"
          >
            Clubs
          </button>
        </div>

        {/* 🤖 PROBOT */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex flex-col items-center text-center">
              <div className="text-sm font-semibold text-gray-700">
                ProBot AI
              </div>
              <button className="text-xs text-blue-500">
                Voice Navigation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER FEED */}
      <div className="w-[50%] flex flex-col gap-6">
        <div className="w-full bg-white rounded-2xl shadow-md p-4 flex items-center gap-3">
          <img
            src={userData.profileImage || dp}
            className="w-12 h-12 rounded-full object-cover"
          />
          <button
            onClick={() => setUploadPost(true)}
            className="w-full h-[45px] border border-gray-300 rounded-full px-4 text-left text-gray-500 hover:bg-gray-100 transition"
          >
            Start a post...
          </button>
        </div>

        {postData.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[25%] bg-white rounded-2xl shadow-md p-4 flex flex-col sticky top-[100px] h-[80vh]">
        <h1 className="text-lg font-semibold text-gray-700 mb-2">
          Suggested Users
        </h1>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {suggestUsers.map((su) => (
            <div
              key={su._id}
              onClick={() => handleGetProfile(su.userName)}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={su.profileImage || dp}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {su.firstName} {su.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {su.headline}
                  </div>
                </div>
              </div>

              <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                Connect
              </button>
            </div>
          ))}

          {suggestUsers.length === 0 && (
            <div className="text-sm text-gray-400">
              No suggestions
            </div>
          )}
        </div>
      </div>

      {/* POST MODAL */}
      {uploadPost && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

          <div className="fixed z-50 top-[100px] left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] bg-white rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <RxCross1
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setUploadPost(false)}
            />

            <textarea
              className="w-full h-[150px] outline-none resize-none text-lg"
              placeholder="What do you want to talk about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input type="file" ref={image} hidden onChange={handleImage} />

            {frontendImage && (
              <img
                src={frontendImage}
                className="rounded-lg max-h-[200px] object-cover"
              />
            )}

            <div className="flex justify-between items-center">
              <FaRegImage
                className="cursor-pointer text-gray-500"
                onClick={() => image.current.click()}
              />

              <button
                onClick={handleUploadpost}
                disabled={posting}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;