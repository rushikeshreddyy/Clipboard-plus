import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware,AuthenticatedRequest} from "./middleware";
import { JWT_SECRET } from "./config";
import { random } from "./utils";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  //TODO zod validation and hash the password,fix the error codes
  const username = req.body.username;
  const password = req.body.password;

   const hashedPassword = await bcrypt.hash(password,10);
  try {
    await UserModel.create({
      username: username,
      password: hashedPassword,
    });

    res.json({ message: "User signed up sucessfully"});
  } catch (e) {
    res.status(409).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
  const existingUser = await UserModel.findOne({ username });
  if (existingUser && typeof existingUser.password==='string'  && await bcrypt.compare(password,existingUser.password)) {
    const token = jwt.sign(
      { id: existingUser._id },
      JWT_SECRET,
      {expiresIn:'1h'}
    ); 

    res.json({ token });
  } else {
    res.status(403).json({ message: "incorrect credentials" });
  }
}
  catch(error) {
    res.status(500).json({message:"Something went wrong, please try again"})
  }
});

app.post("/api/v1/content", userMiddleware,async (req:AuthenticatedRequest, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const type = req.body.type; 
  await ContentModel.create({
    title,
    link,
    type,
    userId: req.userId,
    tags: [],
  });
   res.json({
    message: "Content Added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req:AuthenticatedRequest, res) => {
  const userId = req.userId;
  try {
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content
  });
} catch(error) {
    res.json( {message : "Invalid Username"});
}
});

app.delete("/api/v1/content", userMiddleware,async (req:AuthenticatedRequest, res) => {
  const contentId = req.body.contentId;
 try{
  await ContentModel.deleteMany({
    contentId,
    userId:req.userId
  })
  res.status(200).json({message:"Content Deleted"})
} catch(error) {
   res.status(401).json({message:"Something went wrong,Please try again"})
}
});

app.post("/api/v1/brain/share", userMiddleware,async (req:AuthenticatedRequest,res) => {
  const share = req.body.share;
  if(share) {
    const existingLink = await LinkModel.findOne({
      userId:req.userId
    });
    if(existingLink) {
      res.json({
        hash:existingLink.hash
      })
      return
    }
    const hash=random(10);
    await LinkModel.create({
      userId:req.userId,
      hash:hash
    })
    res.json({
      message:hash
    })
  } else {
   await LinkModel.deleteOne({
      userId:req.userId
    })
  }
  res.status(200).json({
    message:"Updated the share"
  })
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
   const hash = req.params.shareLink;
  const link = await LinkModel.findOne({
     hash
   })
   if(!link) {
    res.json({message:"sorry,Incorrect input"})
    return;
   }
   const content = await ContentModel.find({
    userId:link.userId
   })
   const user = await UserModel.findOne({
    _id:link.userId
   })
    
    if(!user) {
      res.status(411).json({message:"User not found,error should ideally not happen"})
      return;
    }
    res.json({
      username:user.username,
      content:content
    })
    
});


app.get("/api/v1/content/:contentType",userMiddleware,async (req:AuthenticatedRequest,res)=> {
   const reqType = req.params.contentType.toLowerCase();
   const userId = req.userId;
   console.log( 'Hello' + reqType);
   console.log('Hi' + userId);
   try {
     const Values =  await ContentModel.find({
        userId:userId,
        type:reqType
   })
   if(Values.length ===0) {
    res.status(403).json({"message":"NO values"})
   }
   res.status(200).json({Values})
  } catch(error) {
    res.status(403).json({"error":"error"})

  }
})

app.listen(3000);
