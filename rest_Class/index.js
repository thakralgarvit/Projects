// all the necessary packges we need
const express = require("express"); 
const app = express();
const port = 8080; // for localhost
const path = require("path"); // to set some files path 
const { v4: uuidv4 } = require("uuid"); //to get a unique id in here
const methodOverride = require("method-override"); // to override the post & get 

app.use(express.urlencoded({ extended: true})); //to able to encode 
app.use(methodOverride("_method"));

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); //ejs files to know where to llok
app.use(express.static(path.join(__dirname, "public"))); //for css and js files

let posts = [ // dumy data base
    {
        id: uuidv4(),
        username: "garvitthakral",
        content: "i love coding"
    },
    {
        id: uuidv4(),
        username: "veena",
        content: "hard work is the key"
    },
    {
        id: uuidv4(),
        username: "apnacollege",
        content: "reading makes me smart"
    }
];

app.get("/posts", (req, res) => { // main call request
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => { //for new post page
    res.render("new.ejs");
})

app.post("/posts", (req, res) => { //to put data came from the clint into data
    let { username, content} = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
})

app.get("/posts/:id", (req, res) => { //to show perticualr post with id
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs", { post });
})

app.patch("/posts/:id", (req, res) => { //to update a perticular post by id 
    let { id } = req.params;
    let newcont = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newcont;
    res.redirect("/posts");
})

app.get("/posts/:id/edit", (req, res) => { // to get to edit page
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
})

app.delete("/post/:id", (req, res) => { //delete function by id
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");    
})

app.listen(port, () => { // just to let me know server in on
    console.log(`listening to port: ${port}`);
});