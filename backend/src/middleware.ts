import {NextFunction, Request,Response} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export interface AuthenticatedRequest extends Request {
  userId?:string
}
export const userMiddleware=(req:AuthenticatedRequest,res:Response,next:NextFunction):void =>{
  const header = req.headers['authorization'];
  //console.log( 'header' + header);

  if(!header|| !header.startsWith("Bearer ")) {
     res.status(401).json({message:"You are not logged in"})
     return;
  }
  const token = header.split(" ")[1];
 // console.log( 'token' + token);
  if(!token) {
    res.status(401).json({message:"Token is missing or malformed"})
  }
  try {
  const decoded = jwt.verify(token,JWT_SECRET) as {id:string};
  req.userId = decoded.id;
 // console.log('xxxxx'+decoded.id);
  next();
 } catch(error) {
  res.status(403).json({
    message:"Invalid or expired token"
  })
 }

}