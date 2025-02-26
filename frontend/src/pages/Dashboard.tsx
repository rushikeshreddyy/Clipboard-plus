import { useState } from 'react'
import { SideBar } from '../components/Sidebar';
import { CreateContentModel } from '../components/createContentModel';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ShareIcon } from '../Icons/shareIcon';
import { PlusIcon } from '../Icons/PlusIcon';
import { useContent } from '../hooks/useContent';
import { LogoutIcon } from '../Icons/LogoutIcon';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';

function Dashboard() {
 const [modelOpen,setModelOpen] = useState(false);
 const contents =useContent();
 const navigate=useNavigate();

 function logout() {
  const token = localStorage.getItem("token");
  if(token) localStorage.removeItem("token")
    else alert('You are not logged in')
   navigate('/signin');
 }

 async function share() {
  const response =  await axios.post(BACKEND_URL+'/api/v1/brain/share',{
      share:true
     },{
      headers:{
         authorization:localStorage.getItem('token')
      }
     })
     console.log(response);
     if(response.data.hash) {
     await navigator.clipboard.writeText(BACKEND_URL+'/api/v1/brain/'+response.data.hash);
     alert('Link copied to clipboard');
     }
    else alert('Link failed to copy')
 }
  return <div>
    <SideBar/>
    <div className='p-4 ml-64 min-h-screen bg-gray-100 '>
    <CreateContentModel open={modelOpen} onClose={()=>setModelOpen(!modelOpen)}/>
    <div className='flex justify-end gap-4'>
    <Button onClick={share} variant="secondary" text="Share Brain" startIcon={<ShareIcon/>}/>
    <Button onClick={()=> {
      setModelOpen(true);
      }}variant="primary" text="Add Content" startIcon={<PlusIcon/>}/>
      <Button  onClick={logout}variant="danger" text="Logout" startIcon={<LogoutIcon/>}/>
 </div>
  <div className='flex gap-4 flex-wrap flex-grow pt-4'>
    
 {contents.map(({type,link,title})=>
 <Card type={type} title={title} link={link} />)}
 </div>
 </div>
 </div>
}

export default Dashboard
