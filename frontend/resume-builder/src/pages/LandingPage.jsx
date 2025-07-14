import React, { useContext, useState } from "react";
import HERO_IMG from "../assets/Land.png";
import { useNavigate } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Modal from "../components/modal";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/cards/ProfileInfoCard"


function LandingPage() {
  const {user}=useContext(UserContext);
  const navigate = useNavigate();
  const [openAuth, setOpenAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuth(true);
    }
    else{
      navigate("/dashboard");
    }
  };
  

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-sans">
      <div className="container mx-auto px-6 py-12 lg:px-8">
        <header className="flex justify-between items-center mb-24">
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Resume Builder
          </div>
          {user?<ProfileInfoCard />:<button
            className="bg-purple-600 text-sm font-semibold text-white px-8 py-3 rounded-xl shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setOpenAuth(true)}
          >
            Login / Signup
          </button>}
        </header>

        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24 mb-32">
        <div className="w-full md:w-1/2 pr-0 md:pr-4">

            <h1 className="text-6xl font-extrabold leading-tight mb-8 text-gray-900">
              Build Your{" "}
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                Resume Effortlessly
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-xl">
              Craft a standout resume in minutes with our smart and intuitive resume builder.
            </p>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-semibold text-white px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center"> 
            <img
              src={HERO_IMG}
              alt="hero Image"
              className="w-full max-w-lg rounded-3xl shadow-2xl border-4 border-white-500/50"
            />
          </div>
        </div>

        <section className="mt-20">
            <h2 className="text-4xl font-extrabold text-center mb-20 text-gray-900">
                Features that will make you shine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        Easy Editing
                    </h3>
                    <p className="text-gray-600 text-lg">
                        Update your resume sections with live preview and instant formatting. 
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        Beautiful Templates
                    </h3>
                    <p className="text-gray-600 text-lg">
                        Choose from modern, professional templates that are easy to customize.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">One-click Export</h3>
                    <p className="text-gray-600 text-lg">
                        Download your resume instantly as a high-quality PDF with one click.
                    </p>
                </div>
            </div>
        </section>
      </div>
      <Modal 
  isOpen={openAuth}
  onClose={() => {
    setOpenAuth(false);
    setCurrentPage("login");
  }}

>
  <div>
    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
    {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
  </div>
</Modal>

    </div>
  );
}

export default LandingPage;
