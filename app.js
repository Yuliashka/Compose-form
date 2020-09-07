

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "Hello World! I'm Yulia and this is my first Blog Website. I'm going to use it to publish my thoughts, my notes, my stories and everything, that comes to my mind and I want it to be published. To create this Website I used HTML, CSS, Bootstrap, JavaScript, Node.js, EJS, MongoDB with Mongoose and Heroku service. Working on this application used the knowledge and experienced that I got while studying the Web Development Course of Dr. Angela Yu. And I'm incredible thankfull to Angela for all her efforts, her positive and her ability to inspire and instill confidence that everything will definitely work out. Welocome, Guys!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const mongoose = require("mongoose");
app.set('view engine', 'ejs'); //tells our app to use ejs

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const _ = require("lodash"); //подгружаем библиотечку lodash
const { curry } = require("lodash");



//CREATING A NEW DATABASE IN MONGODB
mongoose.connect("mongodb+srv://yulia:privet123@cluster0.3wqj8.mongodb.net/blogWebsiteDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

//CREATING A SCHEMA
const Itemschema = {
  title: String,
  message: String
};

//CREATING A MONGOOSE MODEL (COLLECTION)
const Post = mongoose.model("Post", Itemschema);

//Создали route "/", Передаем от сервера к браузеру информацию
app.get("/", function (req, res) {


  //FINDING ALL POSTS FROM OUR POSTS COLLECTION
  Post.find({}, function (err, foundPosts) { //берем коллекуцию, метод find(), в параметрах(найти все, callback function). 
    if (err) {
      console.log(err)
    } else {

      res.render("home", {
        startingContent: homeStartingContent,
        postsObject: foundPosts
      }); //This is the result that we are going to send back from the server to the user

    }
  });


});


//Создали route "/about", Передаем от сервера к браузеру информацию
app.get("/about", function (req, res) {
  res.render("about", { aboutPage: aboutContent });

});

//Создали route "/contact", Передаем от сервера к браузеру информацию
app.get("/contact", function (req, res) {
  res.render("contact", { contactPage: contactContent });
});

//Создали route "/compose", Передаем от сервера к браузеру информацию со страницы compose.ejs
app.get("/compose", function (req, res) {
  res.render("compose");
});




//Со страницы "/compose" передаем информацию на сервер, информацию берем из <input name="newItem">
app.post("/compose", function (req, res) {

  //CREATING A NEW POST DOCUMENT USING MONGOOSE MODEL
  const post = new Post({
    title: req.body.postTitle,
    message: req.body.postMessage
  })

  post.save(function (err) {
    if (!err) {
      res.redirect("/"); //using method, that allows us to redirect our user to another route "/"
      console.log(post._id);
    }
  }); //add a callback to the save method to only redirect to the home page once save is complete with no errors. Мы перенаправляем
  //на "/", только тогда, когда наш пост полностью сохранен в базе. Иначе может получиться так, что сайт будет перенаправлять на главную
  //страницу, а пост еще не будет виден на ней.

});


//here we are using the express js route parameters
app.get("/post/:postId", function (req, res) {


  //Создаем переменную, в нее пишем данные, полученные из параметров ссылки, а именно postId
  //Далее используем метод mongoose findOne(), в нем ищем нужный нам пост по его id из ссылки, с помощью метода render,
  //передаем этот пост на страничку post.ejs
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }, function (err, currentPost) {
    res.render("post", {
      title: currentPost.title,
      message: currentPost.message
    });

  });


});




let port = process.env.PORT; //let port is equal that heroku has set up
if (port == null || port == "") { //if they havent set up, when the port is null or it is empty string - we use the local one
  port = 3000;
};

app.listen(port, function () {
    console.log("Server is working on port 3000");
});

//EXPRESS JS ROUTE PARAMETERS
//With help of express.js we can avoide writing everytime:
//app.get("/compose", function (req, res) {
//  res.render("compose");
//}); 
//to open our views ejs page at the mentioned route. Instead we can use the Route parameters from:
// http://expressjs.com/en/guide/routing.html
//app.get("/news/:topic", function (req, res) {
 // console.log(req.params.topic) 
//});
//we are tapping into the req.params and that gives us an access to all of the parameters that have a colon (:) in front of it
//and it gives us their values. That means if we head over to localhost:3000/news/science then it should log science over here:
//req.params.topic - we will console.log the science in our hyper terminal. 
//or if we write localhost:3000/news/politics we will log politics in our hyper terminal. So instead of creating a route for every
//single one of these news/science, news/politics and etc. - we can actually use the express routing parameters to do it dynamically. 


//LODASH
//https://lodash.com/
//Is an utility library that makes it easier to work with JS inside our Node apps. 
//At the web page we can see how to install it and how to use it inside our Node.
//В нашей работе мы будем использовать метод _.lowerCase(), чтобы преобразовать в маленькие буквы и текст в url, и текст заголовка

//CREATING DATABASE
//1. Require mongoose
//2. $npm install mongoose
//3. Creating a new database in mongodb
//4. Creating a schema
//5. Creating a mongoose model (Posts collection)
//6. Creating a new post document in our app.post for "/compose" route.
//7. Saving our post document to our database instead of pushing to the posts array. Deleting our existing let posts =[] array.
//7. Find all the posts from Posts collection and rendering it at("/home") route.
//8. Creating a callback function in mongoose seve() method to only redirect to the home page once save is complete with no errors. 
//9. When we cleack on read me of our post, it should take us to the posts.ejs page rendering the correct post using the post_id.

//DEPLOYING DATABASE AT ATLAS
//1. Entering to our Atlas account
//2. Creating a new cluster
//3. Create a database user
//4. Network access. IP whitelist. Add IP Address. Allow access from anywhere.
//5. Connect - Choose a connection method. Connect with MongoDB Shell.
//6. Copy the provided link and pass it into Hyper terminal, changing database name. Enter user's password when Hyper is asking.
//7. Instead of mongod we are now connected to the cloud based cluster. We don't use mongod and after the link running we can't 
//start typing in Mongo commands such as "show dbs".
//8. At the beggining we used the previouse method to running this app - we had to create a new terminal and we said mongod to 
//start up our MongoDB server on port 27017 in our local system. The next thing we did - we back to our previouse shell and we used 
//nodemon to run our app.js. In this way we were running our app on our local MongoDB database.
//9. Go to collections. Add my own data. Create a collection. Create a test database and a test collection.
//10. Now we want to run our app with Atlas. Go to connect, choose a connection method, connect your app, copy the link address, going to our app.js and 
//inside on mongoose.connect() changing the link using our password and our database name.
//11. $Nodemon app.js.
//Delete test DB.


//SETUP HEROKU
//1. Loging to heroku website.
//2. https://devcenter.heroku.com/articles/getting-started-with-nodejs
//3. Heroku must be already installed at computer
//4. https://devcenter.heroku.com/articles/getting-started-with-nodejs#prepare-the-app, https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment
//5. Track your codebase in git repository - $git init - to initialise an empty git repository
//6. $git add . - to add all files to the staging area
//7. $git commit -m "Initial commit " - to commit our app.
//8.  $heroku login
//9. Add a heroku git remote: $heroku create - we will create our new app on Heroku called: gentle-bayou-82182
//10. Add a Procfile - inside our project container folder. $touch Procfile
//11. open Procfile in VSC and writing there: web: node app.js - that tells a heroku that this is a web app and to start it the
//entry point is app.js
//12. Listening on the right port
//13. Use a database or object storage instead of writing to your local filesystem - we already done, using mongoose.connect to Atlas.
//14. Language specific: https://devcenter.heroku.com/articles/deploying-nodejs
//15. We need to add a version of Node.js to our package.json. Open package.json and below the "licence" write: "engines": { "node": "10.x"},
//16. We need to create a gitignore files: we dont want to uoload the node modules to Heroku. Heroku will rebuild all these files
//using dependencies in our package.  $touch .gitignore, open it in VSC and write code: 
/*
/node_modules
npm-debug.log
.DS_Store
/*.env
*/

//17. $git add .
//18. $git commit -m"Add gitignore, procfile and update ports"
//19. $git push heroku master 
//20. Heroku will tell us that now app is launched and released on:  https://gentle-bayou-82182.herokuapp.com/ deployed to Heroku