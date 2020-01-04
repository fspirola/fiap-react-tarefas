// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

//Liberar CORS
var cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite3.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
 
  if (!exists) {
    db.run(
      "CREATE TABLE tarefas_fiap (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, done NUMERIC, createdAt TEXT)"
    );
    console.log("New table tarefas_fiap created!");

    // insert default dreams
    db.serialize(() => {
      db.run(
        'INSERT INTO tarefas_fiap (description, done, createdAt) VALUES ("Fazer Trabalho MBA", 1, "2019-12-14")'
      );
    });
  } else {
    console.log('Database "tarefas_fiap" ready to go!');
    
    db.each("SELECT * from tarefas_fiap", (err, row) => {
      if (row) {
        console.log(`record: ${row.nome}`);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the dreams in the database
app.get("/getTodos", (request, response) => {
  db.all("SELECT * from tarefas_fiap ORDER BY createdAt DESC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a dream to the database
app.post("/addTodo", (request, response) => {
  console.log(`add to tarefas_fiap ${request.body.description}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const description = cleanseString(request.body.description);
    const done = request.body.done;
    const createdAt = cleanseString(request.body.createdAt);
    db.run(`INSERT INTO tarefas_fiap (description, done, createdAt) VALUES (?, ?, ?)`, description, done, createdAt, error => {
      if (error) {
        response.send({ message: "error! " + error });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// endpoint to clear dreams from the database
app.get("/clearTodo", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from tarefas_fiap",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM tarefas_fiap WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error! " + err });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// endpoint to clear dreams from the database
app.get("/deleteTodo?", (request, response) => {
  const id = request.query.id;
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
        console.log("row", id);
        db.run("DELETE FROM tarefas_fiap WHERE ID=?", id, error => {
          if (id) {
            console.log(`record: ${id}`);
          }
      },
      err => {
        if (err) {
          response.send({ message: "error! " + err });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// endpoint to clear dreams from the database
app.put("/updateTodo?", (request, response) => {
  const id = request.query.id;
  const done = request.query.done;
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
        console.log("row", id);
        db.run("UPDATE tarefas_fiap SET done =? WHERE ID=?", done, id, error => {
          if (id) {
            console.log(`record: ${id}`);
          }
      },
      err => {
        if (err) {
          response.send({ message: "error! " + err });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// endpoint para pesquisar tarefas
app.get("/getSearch", (request, response) => {
  const search = request.query.search;
  console.log(search)
  db.all("SELECT * from tarefas_fiap WHERE description LIKE ? ORDER BY createdAt DESC", search, (err, rows) => {
    response.send(JSON.stringify(rows));
    console.log(rows);
  });
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});