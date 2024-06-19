const express = require("express");
// const expressLayout = require("express-ejs-layouts");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;
const contactFunction = require("./contactFunction");

//penggunaan middleware application level middleware
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

//informasi menggunakan ejs
app.set("view engine", "ejs");
// app.use(expressLayout);

//morgan untuk log error
app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  // Memanggil fungsi untuk mendapatkan data
  const contacts = contactFunction.listContact();
  // Mengirim data kontak ke contact.ejs
  res.render("contact", { contacts });
});

app.post("/contact", (req, res) => {
  const { name, phoneNumber, email } = req.body;

  // Validasi input
  if (!name || !phoneNumber || !email) {
    return res.status(400).send("Nama, Nomor Telepon, dan Email harus diisi.");
  }

  // Panggil fungsi createContact dengan parameter yang sesuai
  const contactAdded = contactFunction.createContact(name, phoneNumber, email);

  if (contactAdded) {
    res.redirect("/contact"); // Redirect ke halaman utama setelah berhasil
  } else {
    res.status(500).send("Gagal menambahkan kontak.");
  }
});


app.post('/contact/update/:id', async (req, res) => {
  try {
    const dataPath = "./data/contact.json";
    const loadContact = () => {
      try {
        const file = fs.readFileSync(dataPath, "utf8");
        const contacts = JSON.parse(file);
        return contacts;
      } catch (err) {
        return [];
      }
    };

    const saveContacts = (contacts) => {
      fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
    };

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send('Invalid contact ID');
    }

    let contacts = await loadContact();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      return res.status(404).send('Contact not found');
    }

    contacts[index] = {
      ...contacts[index],
      name: req.body.name || contacts[index].name,
      phoneNumber: req.body.phoneNumber || contacts[index].phoneNumber,
      email: req.body.email || contacts[index].email
    };

    await saveContacts(contacts);
    res.redirect("/contact");
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// app.put('/contact/:id', (req, res) => {
//   const contactId = parseInt(req.params.id, 10);
//   const { name, phoneNumber, email } = req.body;

//   const updatedData = {
//     name,
//     phoneNumber,
//     email,
//   };

//   const updated = contactFunction.updateContact(contactId, updatedData);
//   if (updated) {
//     res.redirect('/contact');
//   } else {
//     res.status(404).send("Kontak tidak ditemukan.");
//   }
// });


app.post('/contact/delete/:id', async (req, res) => {
  try {
    const dataPath = "./data/contact.json";
    const loadContact = () => {
      try {
        const file = fs.readFileSync(dataPath, "utf8");
        const contacts = JSON.parse(file);
        return contacts;
      } catch (err) {
        return [];
      }
    };
    
    const saveContacts = (contacts) => {
      fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
    };
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
          return res.status(400).send('Invalid contact ID');
      }

      let contacts = await loadContact();
      const initialLength = contacts.length;

      contacts = contacts.filter(contact => contact.id !== id);

      if (contacts.length === initialLength) {
          return res.status(404).send('Contact not found');
      }

      await saveContacts(contacts);
      res.redirect("/contact");
  } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).send('Internal Server Error');
    }
});

// app.post("/contact/delete/:id", (req, res) => {
//   const id = parseInt(req.params.id);
  
//   // Panggil fungsi deleteContact dengan ID kontak yang diterima
//   const deleted = contactFunction.deleteContact(id);

//   if (deleted) {
//     res.redirect("/contact");
//   } else {
//     res.status(404).send('Contact not found');
//   }
// });

app.get("/product/:id", (req, res) => {
  res.send(
    `product id : ${req.params.id} <br> + category id: ${req.query.category}`
  );
});

//untuk menampilkan pesan jika route yang dituju tidak ada
// app.use((req, res) => {
//   res.status(404);
//   res.send("page not found : 404");
// });

//untuk mennunjukkan port berjalan
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
