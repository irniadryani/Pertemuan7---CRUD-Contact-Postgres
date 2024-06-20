const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const pool = require("./db");

const port = 3000;

//penggunaan middleware application level middleware
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

//informasi menggunakan ejs
app.set("view engine", "ejs");

//morgan untuk log error
app.use(morgan("dev"));

app.use(express.static("public"));

//route halaman index
app.get("/", (req, res) => {
  res.render("index");
});

//route halaman about
app.get("/about", (req, res) => {
  res.render("about");
});

//get all data contact
app.get("/contact", async (req, res) => {
  try {
    const dataContact = await pool.query(
      `SELECT id, name, "phoneNumber", email FROM contact`
    );
    const contacts = dataContact.rows;
    res.render("contact", { contacts });

  } catch (err) {
    console.error(err.message);
  }
});

//create contact
app.post("/contact", async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    // Validasi input
    if (!name || !phoneNumber || !email) {
      return res
        .status(400)
        .send("Nama, Nomor Telepon, dan Email harus diisi.");
    }
    const addContact = await pool.query(
      `INSERT INTO contact (name, "phoneNumber", email) values ($1, $2, $3) RETURNING *`,
      [name, phoneNumber, email]
    );
    if (addContact) {
      res.redirect("/contact"); // Redirect ke halaman utama setelah berhasil
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Gagal menambahkan kontak.");
  }
});

// update contact
app.post('/contact/update/:id', async (req, res) => {
  try {
    // const { id } = req.params;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send('Invalid contact ID');
    }
    const { name, email, phoneNumber } = req.body;

    const updateContact = await pool.query(
      `UPDATE contact SET name = $1, "phoneNumber" = $2, email = $3 WHERE id = $4`,
      [name, phoneNumber, email, id]
    );
    if (updateContact) {
      res.redirect("/contact"); // Redirect ke halaman utama setelah berhasil
    } else {
      res.status(404).send('Kontak tidak ditemukan');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Gagal memperbarui kontak.");
  }
});

//delete contact
app.post('/contact/delete/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send('Invalid contact ID');
    }
    const deleteContact = await pool.query(
      "DELETE FROM contact WHERE id = $1",
      [id]
    );
    if (deleteContact) {
      res.redirect("/contact"); // Redirect ke halaman utama setelah berhasil
    } else {
      res.status(404).send('Kontak tidak ditemukan');
    }
  } catch (err) {
    console.error(err.message);
  }
});

//untuk mennunjukkan port berjalan
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
