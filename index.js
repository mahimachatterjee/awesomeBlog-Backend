import dotenv from "dotenv";
import express from "express";    
import mongoose from "mongoose";
import cors from "cors";

// import {fileURLToPath} from "url";
// import { dirname } from "path";
dotenv.config()
const blogSchema= new mongoose.Schema({title:String,content:String,author:String});
const blogCollection=mongoose.model('Blogs',blogSchema);
const app=express(); 
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// const fileName=fileURLToPath(import.meta.url);
// const dirName=dirname(fileName);

app.get('/blogs',(request, response)=>{       //end point      //req, response
    console.log(request);
    // response.send('<h1>hello</h1>');
   
    blogCollection.find()
    .then((Blogs)=>{
        response.json(Blogs)
    })
})

app.get('/blogs/perticular/:id', (request, response) => {
    const { id } = request.params;
    blogCollection.findById(id)
    .then((blog) => {
        if(blog) {
            response.json(blog);
        } else {
            response.status(404).json({ msg: "Blog not found" });
        }
    })
    .catch((error) => {
        response.status(500).json({ msg: "Error fetching blog", error });
    });
});

app.post('/blogs/create',(request, response)=>{
    console.log(request.body)
    const newBlog=new blogCollection(request.body);

    newBlog.save()
    .then(()=>{
        response.json({msg:"created"})
    })
})

app.delete('/blog/delete/:id',(request, response)=>{
    const { id } = request.params;
    blogCollection.findByIdAndDelete(id)
    .then((deletedBlog)=>{
        if(deletedBlog){
            response.json({msg:"deleted"})
        } else {
            response.status(404).json({msg:"Blog not found"})
        }
    })
    .catch((error)=>{
        response.status(500).json({msg:"Error deleting blog", error})
    })
})

// app.patch('/update',())
// to initialise      //schema maps the key value to its datatype

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{                        //port,a callback function
        console.log('server is running')
    });
})
