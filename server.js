const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const database = path.join(__dirname, "db/training.db");

const app = express();
const port = 3000;

//app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

// APIs
app.get("/api/submit", (req, res) => {
  saveRecords(req.query);
  res.send("saved");
});

app.get("/api/all", (req, res) => {
  getAllRecords((data) => {
    res.send(data);
  });
});

app.get("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  deleteRecords(id);
  res.send("deleted");
});

//Server
app.listen(port, () => {
  createDataBase();
  console.log(`Server running at http://localhost:${port}`);
});

//functions
function createDataBase() {
  let db = new sqlite3.Database(database);
  db.run(
    "CREATE TABLE Records (firstName text , lastName text, email text, password text , remember text )",
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  db.close();
}

function saveRecords(data) {
  let db = new sqlite3.Database(database);
  let id = 0;
  db.run(
    `INSERT INTO Records(firstName,lastName,email,password,remember) VALUES(?,?,?,?,?)`,
    [data.firstName, data.lastName, data.email, data.password, data.remember],
    function (err) {
      if (err) {
        console.log(err.message);
      }

      id = this.lastID;
      console.log(`A row has been inserted with rowid ${id}`);
    }
  );
  db.close();
}

function getAllRecords(callback) {
  let db = new sqlite3.Database(database);
  let values = [];
  db.all(`SELECT rowid,firstName,lastName,email FROM Records ORDER BY firstName`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      values.push(row);
    });
    callback(values);
  });

  // close the database connection
  db.close();
}

function deleteRecords(id) {
  let db = new sqlite3.Database(database);
  db.run(`DELETE FROM Records WHERE rowId = ?`, [id], function (err) {
    if (err) {
      console.log(err.message);
    }
    console.log(`A row with rowid ${id} has been deleted`);
  });
  db.close();
}
