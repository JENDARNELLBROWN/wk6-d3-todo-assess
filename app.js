const express = require("express");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const app = express();
const models = require("./models");

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static("public"));

app.use(
  session({
    secret: "tROi$ e+ D3uX Et 1",
    resave: false,
    saveUninitialized: true
  })
);

//Listening on root
app.get("/", function(req, res) {
  models.todos
    .findAll({
      where: {
        completed: false
      }
    })
    .then(function(incompleteTasks) {
      models.todos
        .findAll({
          where: {
            completed: true
          }
        })
        .then(function(completeTasks) {
          res.render("index", {
            incompleteTasks: incompleteTasks,
            completeTasks: completeTasks
          });
        });
    });
});

app.post("/", function(req, res) {
  var action = req.body.action;
  if (action == "Add") {
    var newTask = req.body.newTask;
    const todo = models.todos.build({
      title: newTask, completed: false
    });
    todo.save().then(function(newtodo) {
      res.redirect("/");
    });
  } else if (action == "Edit") {
    var id = req.body.id;
    models.todos
      .findOne({
        where: {
          id: id
        }
      })
      .then(function(editTask) {
        res.render("edit", { id: id, title: editTask["title"] });
      });
  } else if (action == "Delete") {
    var id = req.body.id;
    models.todos
      .destroy({
        where: {
          id: id
        }
      })
      .then(function() {
        res.redirect("/");
      });
  } else if (action == "Complete") {
    var id = req.body.id;
    models.todos
      .update(
        {
          completed: true
        },
        {
          where: {
            id: id
          }
        }
      )
      .then(function(todo) {
        res.redirect("/");
      });
  }
});

app.post("/update", function(req, res) {
  var id = req.body.id;
  var editTask = req.body.editTask;
  models.todos
    .update(
      {
        title: editTask
      },
      {
        where: {
          id: id
        }
      }
    )
    .then(function(todo) {
      res.redirect("/");
    });
});

app.listen(3000, function() {
  console.log("Successfully started express application!");
});
