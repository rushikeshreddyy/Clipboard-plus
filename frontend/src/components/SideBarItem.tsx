import { ReactNode } from "react";

export function SideBarItem({text,icon,onClick}:{
  text:string,
  icon:ReactNode,
  onClick:(() => void) | (() => Promise<void>)
}) {
  return  <div className="flex text-gray-700 py-2 cursor-pointer 
  hover:bg-gray-400 rounded max-w-48 pl-4 
  transition-all duration-150" onClick={onClick}> 
  <div className="pr-2">{icon}</div>
  <div>{text}</div>
  </div>
}
