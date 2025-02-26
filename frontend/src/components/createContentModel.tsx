// controlled component
import { CrossIcon } from "../Icons/CrossIcon"
import { Input } from "./Input"
import { Button } from "./Button"
import { useRef, useState } from "react"
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
  Youtube="youtube",
  Twitter="twitter",
  Website = "website"
}
interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}
export function CreateContentModel ({open,onClose} :CreateContentModalProps ){
   const titleRef = useRef<HTMLInputElement|null>(null);
   const linkRef = useRef<HTMLInputElement|null>(null);
   const [type,setType] = useState(ContentType.Youtube)
 async  function addcontent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    await axios.post(BACKEND_URL+"/api/v1/content",{
      title,
      link,
      type
    },{
      headers :{
        "authorization" : localStorage.getItem("token")
      }
    })
    onClose();
  }
  return <div>
    {open &&  <div> <div className="w-screen h-screen bg-slate-500  fixed top-0 left-0 opacity-90 flex justify-center"> 
      </div>
      <div className="w-screen h-screen  fixed  left-0 opacity-90 flex justify-center "> 
     <div className="flex flex-col justify-center min-w-96 "> 
      <span className="bg-white opacity-100 p-4 rounded-md "> 
        <div className="flex justify-end">
          
          <div onClick={onClose} className="cursor-pointer text-red-700 pb-3"> <CrossIcon/></div>
        </div>
        <div className="flex flex-col justify-between space-y-4">
         <Input ref={titleRef} placeholder="Title"/>
         <Input ref={linkRef} placeholder="Link" />
        
         </div>
         <div>
          <div className="flex justify-evenly p-4">
          <Button text="Youtube" variant={type === ContentType.Youtube?"primary":"secondary"} 
          onClick={()=>setType(ContentType.Youtube)}/>
          <Button text="Twitter" variant={type === ContentType.Twitter?"primary":"secondary"}
          onClick={()=>setType(ContentType.Twitter)}/>
          <Button text="Website" variant={type === ContentType.Website?"primary":"secondary"}
          onClick={()=>setType(ContentType.Website)}/>
         </div>
         </div>
         <div className="flex justify-center">
          <Button  onClick={addcontent} variant="starting" text="Submit"/>
          </div>
         </span>
       </div>
       </div>
    </div> }
    
  </div> 
}