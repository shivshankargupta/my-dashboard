var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/";

let authenticate = function(req, res, next) {
  var loggedIn = req.session.isLoggedIn;
  if (loggedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

let authenticated = function(req, res, next) {
  req.session.isLoggedIn = req.session.isLoggedIn ? true : false;
  if (req.session.isLoggedIn) {
    res.locals.user = req.session.user;
    next();
  } else {
    next();
  }
};
router.use(authenticated);

router.use(authenticate);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    layout: "dashboardlayout",
    title: "My dashboard",
    user: req.session.user
  });
});

router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

/* GET users listing. */
router.get("/projects", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("projects")
      .find({})
      .limit(10)
      .toArray(function(err, projects) {
        if (err) throw err;
        db.close();
        res.render("projects/listprojects", {
          layout: "dashboardlayout",
          projects: projects
        });
      });
  });
});

//  create projects*//
router.get("/projects/new", function(req, res, next) {
  res.render("projects/createproject");
});

// submit create projects*/
router.post("/projects/new", function(req, res, next) {
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };

  //write it to the db
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo.collection("projects").insertOne(project, function(err, projects) {
      if (err) throw err;
      db.close();
      //redirect to list of projects page
      res.redirect("/projects");
    });
  });
});

// clicking on a project and get delails in labels
router.get("/projects/:id", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("projects")
      .findOne({ _id: new ObjectId(id) }, function(err, projects) {
        if (err) throw err;
        db.close();
        res.render("projects/projectdetail", {
          layout: "dashboardlayout",
          projects: projects
        });
      });
  });
});
//----------

//backend for when update button is pressed
//backend for when update button is pressed
router.post("/projects/:id", function(req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };
  let updatedproject = { $set: project };

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("projects")
      .updateOne({ _id: new ObjectId(id) }, updatedproject, function(err, p) {
        if (err) throw err;
        db.close();
        res.render("projects/projectdetail", {
          project: project,
          success: true
        });
      });
  });
});

//-------

//delete the projects (one)
router.get("/projects/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("projects")
      .deleteOne({ _id: new ObjectId(id) }, function(err, p) {
        if (err) throw err;
        db.close();
        res.redirect("/projects");
      });
  });
});

// list of blogs
router.get("/blog", function(req, res, next) {
  // Get data from MongoDB
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("myprofile");
    dbo
      .collection("blogs")
      .find({})
      .toArray(function(err, blogs) {
        if (err) throw err;
        db.close();
        res.render("projects/blog", { blogs: blogs, layout: "dashboardlayout" });
      });
  });
});

// create new blog
router.get("/blog/new", function(req, res, next) {
  res.render("projects/createblog");
});
// submit new blog
router.post("/blog/new", function(req, res, next) {
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let blog = { title, image, description };

  //write it to the db
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo.collection("blogs").insertOne(blog, function(err, blogs) {
      if (err) throw err;
      db.close();
      //redirect to list of projects page
      res.redirect("/blog");
    });
  });
});

// edit new blog
router.get("/blog/:id", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("blogs")
      .findOne({ _id: new ObjectId(id) }, function(err, blogs) {
        if (err) throw err;
        db.close();
        res.render("projects/blogdetails", {
          layout: "dashboardlayout",
          blogs:blogs
        });
      });
  });
});
// update the blog
router.post("/blog/:id", function(req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let blog = { title, image, description };
  let updatedblog = { $set: blog };

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("blogs")
      .updateOne({ _id: new ObjectId(id) }, updatedblog, function(err, blogs) {
        if (err) throw err;
        db.close();
        res.render("projects/blogdetails", {
          blogs: blogs,
          success: true
        });
      });
  });
});

// delete blog
router.get("/blog/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("blogs")
      .deleteOne({ _id: new ObjectId(id) }, function(err, blogs) {
        if (err) throw err;
        db.close();
        res.redirect("/blog");
      });
  });
});


// list of people for contact
router.get("/contact", function(req, res, next) {
  // Get data from MongoDB
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("myprofile");
    dbo
      .collection("contacts")
      .find({})
      .toArray(function(err, contact) {
        if (err) throw err;
        db.close();
        res.render("projects/contact", { layout: "dashboardlayout",  contacts: contact
        });
      });
  });
});


//delete of contacts
router.get("/contact/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(id) }, function(err, m) {
        if (err) throw err;
        db.close();
        res.redirect("/contact");
      });
  });
});



// subscribe
router.get("/newsletters", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("newsletter")
      .find({})
      .limit(20)
      .toArray(function(err,newsletters) {
        if (err) throw err;
        db.close();
        res.render("projects/newsletters", {
          layout: "dashboardlayout",
          newsletters:newsletters,
        });
      });
  });
});

   

// subscribe delete
router.get("/newsletters/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("myprofile");
    dbo
      .collection("newsletter")
      .deleteOne({ _id: new ObjectId(id) }, function(err, c) {
        if (err) throw err;
        console.log(JSON.stringify(c));
        db.close();
        res.redirect("/newsletters");
      });
  });
});


//logout
router.get('/logout', function (req, res, next) {
  req.session.isLoggedIn=false
  delete req.session.user;
  res.redirect('/signin')
})
//--------

module.exports = router;
module.exports = router;
