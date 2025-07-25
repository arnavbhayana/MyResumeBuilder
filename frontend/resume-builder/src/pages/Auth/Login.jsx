import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate=useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    // Basic validation (optional)
   if(!validateEmail(email)){
    setError("please enter a valid email address")
    return;
   }
   if(!password){
    setError("please enter a valid password")
    return;
   }
   setError("")

   //login api call
   try {
    const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
      email,
      password,
    });

    const {token}=response.data;

    if(token){
      localStorage.setItem("token",token);
      updateUser(response.data);
      navigate("/dashboard");
    }
   } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("something went wrong.Please try again")
      }
   }
   
  };

  return (
    <div className="w-full p-7 flex flex-col justify-center ">
    <h3 className="text-lg font-semibold  text-black">Welcome Back</h3>
    <p className="text-xs text-slate-700 mt-[5px] mb-6"> Please enter your detail to Login</p>

      <form onSubmit={handleLogin} >

        <Input
        value={email} 
        type="text"
        label="Email Address"
        placeholder="abc@gmail.com"
        onChange={({target})=>setEmail(target.value)} />

      <Input
        value={password} 
        type="password"
        label="Password"
        placeholder="********"
        onChange={({target})=>setPassword(target.value)} />


        {error && <p className="text-red-500 text-xs mb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
            LOGIN
        </button>
        <p className="text-[13px] text-slate-800 mt-3 ">Don't have an account{" "}
        <button
        type="button"
        className="font-medium text-purple-600 underline cursor-pointer"
        onClick={()=>{
            setCurrentPage("signup");
        }}
        >
            SignUp
        </button>
        </p>
        </form>
          
    </div>
  );
};

export default Login;
