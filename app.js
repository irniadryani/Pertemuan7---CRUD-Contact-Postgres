const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

//menunjukkan tempat file json berada
const dataPath = "./data/contact.json";

//fungsi untuk membaca data dari json
const loadContact = () => {
  const file = fs.readFileSync(dataPath, "utf8");
  const contacts = JSON.parse(file);
  return contacts;
};

//fungsi untuk menampilkan list kontak
const listContact = () => {
  const contacts = loadContact();
  console.log('Contact List : ');

  let filteredData = contacts.map(({ name, phoneNumber }) => ({ name, phoneNumber }));
  console.log(JSON.stringify(filteredData, null, 2));

  return filteredData; 
}

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  // Memanggil fungsi untuk mendapatkan data
  const contacts = listContact(); 
  // Mengirim data kontak ke contact.ejs
  res.render("contact", { contacts }); 
});

app.get("/product/:id", (req, res) => {
  res.send(
    `product id : ${req.params.id} <br> + category id: ${req.query.category}`
  );
});

//untuk menampilkan pesan jika route yang dituju tidak ada
app.use((req, res) => {
  res.status(404);
  res.send("page not found : 404");
});

//untuk mennunjukkan port berjalan
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
