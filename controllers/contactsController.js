const contactService = require('../models/contacts');
const HttpError = require('../services/HttpError');
const ctrlWrapper = require('../utils/ctrlWrapper');

const getContacts = async (_, res, next) => {
    const contacts = await contactService.listContacts();
    res.json(contacts);
}

const getContactsById = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await contactService.getContactById(id);

    if (!contact) {
        throw HttpError(404, 'Not found');
    }

    res.json(contact);
}

const addContacts = async (req, res, next) => {
    const contact = await contactService.addContact(req.body);
    res.status(201).json(contact);
}

const updateContactsById = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await contactService.updateContact(id, req.body);

    if(!contact) {
        throw HttpError(404, 'Not found')
    }
    
    res.status(201).json(contact);
}

const deletContactsById = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await contactService.removeContact(id);

    if(!contact) {
        throw HttpError(404, 'Not found')
    }

    res.json({
        message: "Delete success"
    });
}

module.exports = {
    getContacts: ctrlWrapper(getContacts),
    getContactsById: ctrlWrapper(getContactsById),
    addContacts: ctrlWrapper(addContacts),
    updateContactsById: ctrlWrapper(updateContactsById),
    deletContactsById: ctrlWrapper(deletContactsById),
}