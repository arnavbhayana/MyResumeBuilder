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
    <div className="w-full min-h-full bg-white pb-96">
      <div className="container mx-auto px-4 py-6">
        {/* header */}
        <header className="flex justify-between items-center mb-16">
          <div className="text-xl font-bold">Resume Builder</div>
          {user?<ProfileInfoCard />:<button
            className="bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
            onClick={() => setOpenAuth(true)}
          >
            Login/Signup
          </button>}
        </header>

        {/* hero content */}
        <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 pr-2 mb-8">

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Build Your <span className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent">Resume Effortlessly</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Craft a standout resume in minutes with our smart and intuitive resume builder.
            </p>
            <button
              className="bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"

              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2"> 
            <img src={HERO_IMG} alt="hero Image" className="w-full max-w-md rounded-lg" />
          </div>
        </div>

        <section className="mt-5">
            <h2 className="text-2xl font-bold text-center mb-12">
                Features that will make you shine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-3">
                        Easy Editing
                    </h3>
                    <p className="text-gray-600">
                        Update your resume sections with live preview and instant formatting. 
                    </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-3">
                        Beautiful Templates
                    </h3>
                    <p className="text-gray-600">
                        choose from modern,professional templates that are easy to customize
                    </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-3">One-click Export</h3>
                    <p className="text-gray-600">
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
