// create user models and schemas

import mongoose, {model,Schema} from "mongoose";
import { DATABASE_URL } from "./config";

mongoose.connect(DATABASE_URL)

const UserSchema = new Schema({
  username:{type:String,required:true,unique:true},
  password:{type:String,required:true}
})

export const UserModel = model("User",UserSchema);

const ContentSchema = new Schema({
  title:{type:String,required:true},
  link:{type:String,required:true},
  type:String,
  tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
  userId:{type:mongoose.Types.ObjectId,ref:'User'}
})

export const ContentModel = model("Content",ContentSchema);

const LinkSchema = new Schema({
 hash:{type:String},
 userId:{type:mongoose.Types.ObjectId,ref:'User',required:true,unique:true}
})

export const LinkModel = model("Link",LinkSchema);


// const TagSchema = new Schema({
//   title:{type:String,required:true,unique:true}
// })

// export const TagModel = model('Tag',TagSchema);