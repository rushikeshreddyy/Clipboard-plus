import { ReactNode } from "react";

interface ButtonProps{
  variant:"primary"|"secondary"|"danger"|"starting",
  text:string,
  startIcon?:ReactNode,
  endIcon?:ReactNode,
  onClick?:()=>void,
  fullWidth?:boolean,
  loading?:boolean
}

const variantClasses ={
  "primary" : "bg-purple-600 text-white",
  "secondary":"bg-purple-200 text-white-400",
  "danger" : "bg-red-300 text-purple",
  "starting":"bg-black text-white"
}

const defaultStyles ="px-4 py-2 rounded-md font-light flex items-center";

export function Button({variant,text,startIcon,onClick,fullWidth,loading}:ButtonProps) {
 return <button onClick={onClick} className={` ${variantClasses[variant]} ${defaultStyles} ${fullWidth?" w-full flex justify-center items-center":" "} 
 ${loading?"opacity-50":""}`} disabled={loading}>
   <div className="pr-2">{startIcon}</div>{text}
 </button>
}