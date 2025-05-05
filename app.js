const express = require("express");
const fs = require("fs");
 
const app = express();
const userRouter = express.Router();

// **Всегда использовать urlencoded?
const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();


// Middleware for logging requests
app.use(function(request, response, next){
     
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", function(error){
        if(error) return console.log(error);   
        console.log("Logging complete");
    });
    next();
});

app.use(express.static("public"));


// Routes for the app
app.get("/", function(request, response){
    response.send("<h1>Main page</h1>");
});

// **Почему не работает с POST?
// app.use("/about", function (_, response) {
//     response.sendFile(__dirname + "/index.html");
// });

app.get("/about", function (_, response) {
    response.sendFile(__dirname + "/index.html");
});

app.post("/about", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    response.send(`Name: ${request.body.userName} - Age: ${request.body.userAge}`);
});

app.get("/contact", function(request, response){
    response.send("<h1>Contacts</h1>");
});

app.get("/error", function(request, response){
    response.status(404).send('<h2 style="color: red">Whoops you get an error</h2>');
});

// Router for users
userRouter.use("/create", function(request, response){
    response.send("<h3>Create user</h3>");
  });

// Use JSON in response  
userRouter.use("/:id", function(request, response){
    response.json({userId: request.params.id});
  //  response.send(`<h3>User ID: ${request.params.id}</h3>`);
});

userRouter.use("/", function(request, response){
    response.send("<h3>Users list</h3>");
});

// Mount the product router on the /users path
app.use("/users", userRouter);


// Run the server
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});