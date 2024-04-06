import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import bodyParser from "body-parser";
import fs, { fsync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express ();
const port = 3000;
const folderPath = "/uploads"
let posts = [];
let postIdCounter = 1;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const storage = multer.memoryStorage({
    destination: function (req, file, cb){
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath)
        }
        cb(null, folderPath)
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + "_" + file.originalname)
    }
})
const upload = multer({storage: storage});

/* sending information to server */
app.post("/create-post", upload.single("image"), (req, res) => {
    const base64Image = req.file.buffer.toString('base64');

    const newPost = {
        id: postIdCounter++,
        category: req.body.category,
        heading: req.body.heading,
        date: req.body.date,
        image:base64Image,
        content: req.body.content,
        mime: req.file.mimetype,
        postInformant: req.body.postInformant,
    }
posts.push(newPost)
res.redirect("/")
})


/* parent route */
app.get("/", (req, res) =>{
    const postByCategory = {}
    
    posts.forEach(post=> {
    if(!postByCategory[post.category]){
        postByCategory[post.category] =[]
    }
    postByCategory[post.category].push(post)

})
const preview = {};
Object.keys(postByCategory).forEach(category => {
    preview[category] = postByCategory[category].slice(-4)
    
})
    const title = "Home page";
    res.render("home.ejs", { title, preview});
});

/* route for World page*/
app.get("/world", (req,  res) =>{
    const categories = {};
    posts.forEach(post =>{
        if(post.category.trim() === "WORLD"){    
            if(!categories[post.category]){
                categories[post.category] = []
            }
            categories[post.category].push(post)
        }    
       
    })
    
const title = "WORLD"
    res.render("world.ejs", {title, categories})
    })
   

/* route for technology page*/
app.get("/tech", (req, res) => {
    const categories ={};
    posts.forEach(post =>{
        if (post.category.trim() === "TECHNOLOGY"){
            if(!categories[post.category]){
                categories[post.category] = []
            }
            categories[post.category].push(post)
        }
    });

    const title=  "TECHNOLOGY";
    res.render("tech.ejs", {title, categories})
})

/* route for design page */
app.get("/design", (req,  res) =>{
    const categories ={};
    posts.forEach(post=>{
        if(post.category.trim() === "DESIGN"){
            if(!categories[post.category]){
                categories[post.category] = []
            }
        
        categories[post.category].push(post);
        }
    })
    const title = "DESIGN";
    res.render("design.ejs", {title, categories})
})

/* route for culture page*/
app.get("/culture", (req,  res) =>{
    const categories = {};
    posts.forEach(post =>{
        if(post.category.trim() === "CULTURE"){    
            if(!categories[post.category]){
                categories[post.category] = []
            }
            categories[post.category].push(post)
        }    
  })
const title = "CULTURE"
    res.render("culture.ejs", {title, categories})
    })



/* route for Science page*/
app.get("/science", (req, res)=>{
    const categories = {};
    posts.forEach(post=>{
        if(post.category.trim() === "SCIENCE"){
            if(!categories[post.category]){
                categories[post.category] = [];
            }
            categories[post.category].push(post);
        }
    })
    const title = "SCIENCE";
    res.render("science.ejs", {title, categories})
})

/* route for travel page*/
app.get("/travel", (req, res)=>{
    const categories = {};
    posts.forEach(post=>{
        if(post.category.trim() === "TRAVEL"){
            if(!categories[post.category]){
                categories[post.category] = [];
            }
            categories[post.category].push(post);
        }
    })
    const title = "TRAVEL";
    res.render("travel.ejs", {title, categories})
})

/* route for politics page */
app.get("/politics", (req, res)=>{
    const categories = {};
    posts.forEach(post=>{
        if(post.category.trim() === "POLITICS"){
            if(!categories[post.category]){
                categories[post.category] = [];
            }
            categories[post.category].push(post);
        }
    })
    const title = "POLITICS";
    res.render("politics.ejs", {title, categories})
})

/* route for business page*/
app.get("/business", (req, res)=>{
    const categories = {};
    posts.forEach(post=>{
        if(post.category.trim() === "BUSINESS"){
            if(!categories[post.category]){
                categories[post.category] = [];
            }
            categories[post.category].push(post);
        }
    })
    const title = "BUSINESS";
    res.render("business.ejs", {title, categories})
})

/* route for display continue*/
app.get("/displayContinue", (req, res) => {
    const postByCategory ={}
      posts.forEach(post =>{
     
        if(!postByCategory[post.category]){
            postByCategory[post.category] = []
        }
        postByCategory[post.category].push(post)
       
    })
    const postId = parseInt(req.query.id);
    let reframe = {};
    for (const category in postByCategory) {
        if (postByCategory.hasOwnProperty(category)) {
            const poster = postByCategory[category].find(post => post.id === postId);
            
            if (poster) {
                if (!reframe[category]) {
                    reframe[category] = [];
                }
                reframe[category].push(poster);
                break; // Exit loop if post is found
            }
        }
    }

    const title = "displayContent";
    res.render("displayContinue.ejs", { title, postByCategory, reframe });
});


app.get("/createPost", (req, res)=>{
        res.sendFile(__dirname + "/public/createPost.html")
})



app.listen(port, ()=>{
console.log(`server is running on  port ${port}`)

})