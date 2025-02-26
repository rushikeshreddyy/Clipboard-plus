import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
 const usernameRef = useRef<HTMLInputElement|null>(null);
 const passwordRef = useRef<HTMLInputElement|null>(null);
 const [errorMessage, setErrorMessage] = useState<string | null>(null); 
 
 const navigate = useNavigate();

 const validateInputs = () => {
  const username = usernameRef.current?.value;
  const password = passwordRef.current?.value;
  const usernameError = username?.trim().length;
  const passwordError = password?.trim().length;

  if (usernameError === 0 && passwordError === 0) {
    setErrorMessage("Username and password are required");
    return false;
  }
  if (usernameError === 0) {
    setErrorMessage("Username is required");
    return false;
  }
  if (passwordError === 0) {
    setErrorMessage("Password is required");
    return false;
  }
  return true;
};

  async function signup() {

    setErrorMessage(null); 

    if (!validateInputs()) {
      return; 
    }

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
  try {
    console.log(BACKEND_URL +'/api/v1/signup');
    await axios.post(BACKEND_URL + "/api/v1/signup",{
    username,
    password
  })
  navigate('/signin');
  
}catch(error) {
   setErrorMessage('Username already exists or an error occured')
}
  }
  return <div className="min-h-screen bg-gradient-to-t from-orange-200 to-pink-200 flex flex-col justify-center items-center">
    <div className="flex-col justify-evenly items-center py-8">
       <h1 className="text-2xl md:text-6xl text-center pb-2 bold">Brainly</h1>
       <p className=" text-sm md:text-md">A Better place to store your Bookmarks</p>
       </div>
       
    <div className="flex flex-col justify-between bg-white rounded-xl border  min-w-24 md:min-w-96 p-8 space-y-4"> 
      <div className="w-full space-y-4 space-y">
     <Input  ref={usernameRef}placeholder="Username"/>
    <Input ref={passwordRef} placeholder="Password"/>
    </div>
  <Button  onClick={signup} loading={false} variant="starting" text="Signup" fullWidth={true}/>
  {errorMessage && <p className="text-red-500 text-center m-2">{errorMessage}</p>}
  
    </div>

    <p className="text-slate-600">Already have an account? <a href="/signin" className="underline">Signin</a></p>

  </div>
}