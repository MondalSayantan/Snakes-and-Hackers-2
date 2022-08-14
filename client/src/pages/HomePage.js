import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.name === "create") {
      navigate("/create");
    } else if (e.target.name === "join") {
      navigate("/join");
    }
  };
  return (
    <div className="landing-page h-screen flex justify-center items-center">
      <div className="w-2/5 mx-auto bg-blueDark rounded-lg border border-gray-200 shadow-md h-3/5 py-5 ">
        <h1 className="tex-black text-center text-7xl font-Rubik font-semibold text-red-700">
          Stakes and Games
        </h1>
        <div className="flex justify-center items-center mt-5 h-4/5 ">
          <button
            className="bg-orange-600 hover:bg-yellow-700 py-3 px-8 rounded-lg text-yellow-100 border-b-4 border-yellow-700 hover:border-yellow-800 transition duration-300 m-5 text-3xl"
            name="create"
            onClick={handleClick}
          >
            Create a Game!
          </button>
          <button
            className="bg-orange-600 m-5 hover:bg-yellow-700 py-3 px-8 rounded-lg text-yellow-100 border-b-4 border-yellow-700 hover:border-yellow-800 transition duration-300 text-3xl"
            name="join"
            onClick={handleClick}
          >
            Join a Game!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
