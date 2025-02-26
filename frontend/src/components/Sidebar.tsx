import { SideBarItem } from "./SideBarItem";
import {TwitterIcon} from "../Icons/TwitterIcon"
import { YoutubeIcon } from "../Icons/YoutubeIcon";
import { Logo } from "../Icons/Icon";
import { BACKEND_URL } from "../config";
import axios from "axios";


export function SideBar(){
  async function showContent(type:string) {
   await axios.get(BACKEND_URL+'/api/v1/content/:contentType',{
      headers:{
         authorization:localStorage.getItem('token')
      },
        params:{
          contentType:type
        }
     })
  }


  return <div className="h-screen bg-white shadow-2xl w-64 fixed
  left-0 top-0 pl-6"> 
   <div className="flex items-center text-2xl pt-8">
    <div className="  pr-2 text-purple-600 font-extrabold "><Logo/></div> 
    <h1>Brainly</h1>
   </div>
       <div className="pt-8 pl-4">
        <SideBarItem onClick={()=>showContent("twitter")} text="Twitter" icon={<TwitterIcon/>}/>
        <SideBarItem onClick={()=>showContent("youtube")} text="Youtube" icon={<YoutubeIcon/>}/>
       </div>
  </div>
}