

interface inputProps{
  placeholder:string,
  ref?:any
}

export function Input({placeholder,ref}:inputProps) {
  return <div>
  <input ref={ref} placeholder={placeholder} type={"text"} className=" w-full px-3 py-2 text-black rounded-md border-2"></input>
  </div>
}