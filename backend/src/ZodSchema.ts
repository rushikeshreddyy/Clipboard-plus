import {Request,Response, NextFunction } from "express";
import {z} from "zod";

const formSchema = z.object({
  username:z.string()
  .min(3,'Username must be atlease 3 characters')
  .max(50,"Username must not exceed 50 characters"),

  password:z.string()
  .min(6,"Password must be min of 6 characters")
  .max(50,"Password must be maximum of 50 Characters")
});

type FormData = z.infer<typeof formSchema>;
 export interface ValidatedRequest extends Request {
  validatedForm:FormData;
  user:{
    id:string;
  }
}
export const validateForm = async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
  try{
    const validatedData = await formSchema.parseAsync(req.body);
    (req as ValidatedRequest).validatedForm = validatedData;
    return next();
  } catch(error) {
    if(error instanceof z.ZodError) {
    res.status(400).json({
      success:false,
      message:"Form validation Failed",
      errors:error.errors.map(err =>({
        field:err.path.join('.'),
        message:err.message
      }))
    });
    return;
  }
   res.status(500).json({
  success:false,
  message:"Internal server error"
})
}

return;
};