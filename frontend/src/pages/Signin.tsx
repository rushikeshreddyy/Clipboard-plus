import axios from "axios";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Signin() {
   const usernameRef = useRef<HTMLInputElement|null>(null);
   const passwordRef = useRef<HTMLInputElement|null>(null);
   const [errorMessage, setErrorMessage] = useState<string | null>(null); 
   const navigate = useNavigate();
  async function signin() {
    
    const username = usernameRef.current?.value;
    const  password = passwordRef.current?.value;
    console.log(usernameRef.current);
    console.log(passwordRef.current);
   
    try {
      console.log(BACKEND_URL +'/api/v1/signin');
    const response =  await axios.post(BACKEND_URL + "/api/v1/signin",{
      username,
      password
    })
    const jwt = response.data.token;
    localStorage.setItem("token",'Bearer '+jwt);
    navigate('/dashboard');
    
  }catch(error) {
    setErrorMessage('Username or password is incorrect');
    console.log('error in sendingdetails to the backend')
    console.log(error);
  }
}
  return  <div className="min-h-screen bg-gradient-to-t from-orange-200 to-pink-200 flex flex-col justify-center items-center">
  <div className="flex-col justify-evenly items-center py-8">
     <p className=" text-md md:text-2xl md:bold">Get Started with Brainly</p>
     </div>
     
  <div className=" flex flex-col justify-between bg-white-200 rounded-xl border min-w-24 md:min-w-96 p-8  space-y-4"> 
    <div className="w-full space-y-4 space-y">
   <Input  ref={usernameRef}placeholder="Username"/>
  <Input ref={passwordRef} placeholder="Password"/>
  </div>
<Button  onClick={signin} loading={false} variant="starting" text="Signin" fullWidth={true}/>
{errorMessage && (
          <p className="text-red-500 text-center mt-2">{errorMessage}</p>
        )}
  </div>

  <p className="text-slate-600">Don't have an account? <a href="/signup" className="underline">Signup</a></p>

</div>
}