const express = require('express');
const mustache = require('mustache-express');
const bodyparser= require('body-parser');
const Sequelize = require('sequelize');

//establish server
const server= express();

//initialize mustache engine
server.engine("mustache", mustache());
server.set("views", "./templates");
server.set("view engine", "mustache");

//initialize body parser for the form
server.use(bodyparser.urlencoded({ extended: false }));


// ************* Schema Start **********************


const db = new Sequelize('todo', 'christianhaasis', '', {
    dialect: 'postgres',
});

const Todo = db.define('todo', {
    item: Sequelize.STRING,
    complete: Sequelize.BOOLEAN,
});

// Sychronize the 'todo' schema with the database, meaning make
// sure all tables exist and have the right fields.
Todo.sync().then(function () {
    console.log('todo model syncd');

    // Todo.create({
    //      item: 'Create todo list',
    //      complete: false,
    // });
});


// ************* Schema End **********************

//establish routes

  //get routes
  //todolist home
    server.get("/", function(req, res){

      Todo.findAll().then(function(items){
        res.render('list', {

                  todo: items,
        });
      });
    });

  //post routes
    //add a new item to the list
    server.post('/new', function(req, res){

        Todo.create({

          item: req.body.newTodo,
          complete: false,

        }).then(function(){
          //re-render the page
          res.redirect('/');
        });
    });

    //if it is complete then make the complete field true
    server.post('/completed/:todo_id', function(req, res){
        const id = parseInt(req.params.todo_id);
        console.log(id);

        Todo.update({
            complete: true,
          }, {
            where: {
              id: id,
            },
          }).then(function(){
            res.redirect('/');
          });

        });

    //when the .....

    server.listen(3003, function(){
      console.log("Todo list booted successfully on port 3003");
    });
