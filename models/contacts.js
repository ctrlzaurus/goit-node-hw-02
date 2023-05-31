const { Schema, model } = require('mongoose');
const handleMongooseError = require('../services/handleMongooswError');

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
}, {
  versionKey: false
});

contactSchema.post('save', handleMongooseError);

const Contact = model('contact', contactSchema);

module.exports = Contact;

// const { v4: uuidv4 } = require("uuid");
// const fs = require('fs/promises');
// const path = require('path');

// const contactsPath = path.join(__dirname, 'contacts.json');

// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath);
//   return JSON.parse(data);
// }

// const getContactById = async (contactId) => {
//   const contacts = await listContacts();
//     const contact = contacts.find(item => item.id === contactId) || null;
//     return contact;
// }

// const removeContact = async (contactId) => {
//   const contacts = await listContacts();
//     const i = contacts.findIndex((item) => item.id === contactId);
//     if (i === -1) return null;
//     const reContact = contacts.splice(i, 1);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return reContact[0];
// }

// const addContact = async (body) => {
//   const contacts = await listContacts();
//   const newContact = {
//       id: uuidv4(),
//       ...body,
//   }
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return newContact;
// }

// const updateContact = async (contactId, body) => {
//   const contacts = await listContacts();
//   const i = contacts.findIndex((item) => item.id === contactId);
//   if (i === -1) return null;
//   contacts[i] = { ...contacts[i], ...body };
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return contacts[i];
// }

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }
