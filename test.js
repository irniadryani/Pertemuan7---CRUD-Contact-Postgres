//module express
const express = require("express");
//express library
const app = express();
//panggil database
const pool = require("./db");

app.use(express.json()); //req.body
const port = 3000;

//insert data to database
app.get("/addasync", async (req, res) => {
  try {
    const name = "User3";
    const phoneNumber = "085679868";
    const email = "user3@gmail.com";
    const newCont = await pool.query(
      `INSERT INTO contact (name, "phoneNumber", email) values ('${name}', '${phoneNumber}', '${email}') RETURNING *`
    );
    res.json(newCont);
  } catch (err) {
    console.error(err.message);
  }
});

//get list data contact
app.get("/contact", async (req, res) => {
  try {
    const listContact = await pool.query(
      `SELECT name, "phoneNumber" FROM contact`
    );
    res.json(listContact.rows);
  } catch (error) {
    console.error(err.message);
  }
});

//get detail data contact
app.get("/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const detailContact = await pool.query(
      "SELECT * FROM contact WHERE id = $1",
      [id]
    );
    res.json(detailContact.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create contact
app.post("/contact"),
  async (req, res) => {
    try {
      const { name, phoneNumber, email } = req.body;
      const addContact = await pool.query(
        `INSERT INTO contact  (name, "phoneNumber", email) VALUES VALUES($1, $2, $3) RETURNING *`,
        [name, phoneNumber, email]
      );
      if (addContact) {
        res.redirect("/contact"); // Redirect ke halaman utama setelah berhasil
      }
    } catch (err) {
      console.error(err.message);
    }
  };

//update contact
app.put("/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;
    const updateContact = await pool.query(
      "UPDATE contact SET name = $1 , phoneNumber= $2, email= $3 WHERE id= $4",
      [name, phoneNumber, email, id]
    );
    if (updateContact) {
      res.redirect("/contact"); // Redirect ke halaman utama setelah berhasil
    }
  } catch (err) {
    console.error(err.message);
  }
});

//delete contact
app.delete("/contact:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteContact = await pool.query(
      "DELETE FROM contact WHERE id = $1",
      [id]
    );
    res.redirect("/contact");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
