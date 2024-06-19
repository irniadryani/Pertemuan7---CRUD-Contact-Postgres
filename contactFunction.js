const fs = require("fs");
const validator = require("validator");

//menunjukkan tempat file json berada
const dataPath = "./data/contact.json";

//fungsi untuk membaca data dari json
// const loadContact = () => {
//   const file = fs.readFileSync(dataPath, "utf8");
//   const contacts = JSON.parse(file);
//   return contacts;
// };
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

//fungsi untuk menampilkan list kontak
const listContact = () => {
  const contacts = loadContact();
  console.log("Contact List : ");

  let filteredData = contacts.map(({ id, name, phoneNumber, email }) => ({
    id,
    name,
    phoneNumber,
    email,
  }));
  console.log(JSON.stringify(filteredData, null, 2));

  return filteredData;
};

//fungsi untuk menampilkan detail kontak
const detailContact = (id) => {
  // mencari data berdasarkan id yang diinput
  const contact = loadContact.find((contact) => contact.id === id.id);

  // jika ada munculkan detail contact
  if (contact) {
    console.log(JSON.stringify(contact, null, 2));
  } else {
    console.log(`Kontak dengan ID ${id.id} tidak ditemukan.`);
  }
};

//fungsi untuk tambah kontak
// const createContact = () => {
//   const contacts = loadContact();
//   let id = contacts.length + 1;
//   while (contacts.find((contact) => contact.id === id)) {
//     id++;
//   }

//   // memasukan data yang diinput kedalam const
//   const contact = { id, name, phoneNumber, email };
// 0
//   //validasi nomor telepon dan email
//   if (
//     !validator.isEmail(email) ||
//     !validator.isMobilePhone(phoneNumber, "id-ID")
//   ) {
//     console.log("Email atau Nomor Telepon Tidak Valid");
//     return false;
//   }
//   contacts.push(contact);
//   fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
//   console.log(`Data berhasil dibuat`);
// };

// const createContact = (name, phoneNumber, email) => {
//   const contacts = loadContact();
//   let id = contacts.length + 1;
//   while (contacts.find((contact) => contact.id === id)) {
//     id++;
//   }

//   const newContact = { id, name, phoneNumber, email };
//   contacts.push(newContact);
//   saveContacts(contacts);

//   console.log(`Data berhasil dibuat: ${JSON.stringify(newContact)}`);
//   return true;
// };

const createContact = (name, phoneNumber, email) => {
  const contacts = loadContact();
  let id = contacts.length + 1;

  while (contacts.find((contact) => contact.id === id)) {
    id++;
  }

  const newContact = { id, name, phoneNumber, email };
  contacts.push(newContact);
  saveContacts(contacts);

  console.log(`Data berhasil dibuat: ${JSON.stringify(newContact)}`);
  return true;
};

//fungsi untuk update kontak
const updateContact = (idFind, {name, phoneNumber, email}) => {
    const contacts = loadContact();
    
    // Cari index dari kontak yang akan diupdate
    const idToUpdate = contacts.findIndex(contact => contact.id === idFind);
  
    if (idToUpdate <= 0) {
      console.log(`Kontak dengan ID ${idFind} tidak ditemukan.`);
      return false;
    }
  
    // Update data kontak
    contacts[idToUpdate].name = name;
    contacts[idToUpdate].phoneNumber = phoneNumber;
    contacts[idToUpdate].email = email;
  
    // Simpan perubahan ke file JSON
    saveContacts(contacts);
  
    console.log(`Kontak dengan ID ${idFind} berhasil diperbarui.`);
    return true;
  };
  
  

// const deleteContact = (id) => {
//   const contacts = loadContact();
//   const contact = contacts.filter((contact) => contact.id !== id.id);

//   if (contacts.length > contact.length) {
//     fs.writeFileSync("data/contacts.json", JSON.stringify(contact, null, 2));
//     console.log(`Kontak berhasil dihapus`);
//   } else {
//     console.log(`Kontak tidak ada`);
//   }
// };

const deleteContact = (id) => {
    const contacts = loadContact(); // Memuat data kontak dari file
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
  
    if (contacts.length > updatedContacts.length) {
      // Jika ada perubahan (kontak berhasil dihapus)
      fs.writeFileSync("data/contacts.json", JSON.stringify(updatedContacts, null, 2));
      console.log(`Kontak berhasil dihapus`);
      return true; // Mengembalikan true jika berhasil menghapus
    } else {
      console.log(`Kontak tidak ada`);
      return false; // Mengembalikan false jika kontak tidak ditemukan
    }
  };

module.exports = {
  listContact,
  detailContact,
  createContact,
  updateContact,
  deleteContact,
};
