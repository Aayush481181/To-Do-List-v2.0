const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/ToDoList");

const toDoListSchema = new mongoose.Schema({
  toDo: String,
});

const ToDoList = mongoose.model("ToDoList", toDoListSchema);
const WorkList = mongoose.model("WorkList", toDoListSchema);

var items = [];
var work = [];
const Refresh = () => {
  ToDoList.find((err, list) => {
    if (err) {
      console.log(err);
    } else {
      list.forEach((l) => {
        items.push(l);
      });
    }
  });
  WorkList.find((err, list) => {
    if (err) {
      console.log(err);
    } else {
      list.forEach((l) => {
        work.push(l);
      });
    }
  });
};

app.get("/", (req, res) => {
  items = [];
  work = [];
  Refresh();
  setTimeout(() => {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var today = new Date();
    var date = today.toLocaleDateString("en-US", options);
    res.render("list", { title: date, i: items });
  }, 100);
});

app.post("/", (req, res) => {
  var item = req.body.item;
  if (req.body.submit === "Work") {
    const work = new WorkList({
      toDo: item,
    });
    work.save();
    // work.push(item);
    res.redirect("/work");
  } else {
    // items.push(item);
    const work = new ToDoList({
      toDo: item,
    });
    work.save();
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  work = [];
  Refresh();
  setTimeout(() => {
    res.render("list", { title: "Work", i: work });
  }, 100);
});
app.post("/work", (req, res) => {
  var item = req.body.item;
  // work.push(item);
  const work = new WorkList({
    toDo: item,
  });
  work.save();
  res.redirect("/work");
});

app.post("/delete", (req, res) => {
  // console.log(req.body.checkbox);
  // console.log(req.body);
  if (req.body.title === "Work") {
    WorkList.deleteOne({ _id: req.body.checkbox }, (err) => {
      if (!err) {
        console.log("Successfully deleted the checked item.....!!");
        res.redirect("/work");
      }
    });
  } else {
    ToDoList.findByIdAndRemove({ _id: req.body.checkbox }, (err) => {
      if (!err) {
        console.log("Successfully deleted the checked item.....!!");
        res.redirect("/");
      }
    });
  }
});

app.get("/About", (req, res) => {
  res.render("About");
});
app.listen(3000, () => {
  console.log("Listening on Port 3000....");
});
