import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/profilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/UploadImage";


const Signup = ({ setCurrentPage }) => {
  const [ProfilePic, setProfilePic] = useState(null);
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const {updateUser}=useContext(UserContext);
  const navigate = useNavigate();

  //handle submit from
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
  
    if (!fullName) {
      setError("Please enter full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
  
    setError("");
  
    try {
      if (ProfilePic) {
        const imgUploadRes = await uploadImage(ProfilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
  
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });
  
      const { token } = response.data;
  
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  

  return (
    <div className="w-full p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering details below</p>
      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={ProfilePic} setImage={setProfilePic} />
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2 ">
          <Input
            value={fullName}
            onChange={({ target }) => setFullname(target.value)}
            label="Full Name"
            placeholder="John"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="John@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          SIGN UP
        </button>
        <p className="text-[13px] text-slate-800 mt-3">
          Already an account?{" "}
          <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
