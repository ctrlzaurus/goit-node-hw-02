const HttpError = require('../services/HttpError');
const ctrlWrapper = require('../utils/ctrlWrapper');
const Contact = require('../models/contacts');

const getContacts = async (req, res, next) => {
    const { id: owner } = req.user;
    const { page=1, limit=20 } = req.query;
    const skip = (page -1) * limit;
    const contacts = await Contact.find({ owner }, { skip, limit }).populate("owner", "email");
    res.json(contacts);
}

const getContactsById = async (req, res, next) => {
    const id = req.params.contactId;
    const { id: owner } = req.user;
    const contact = await Contact.findOne({_id: id, owner}).populate("owner", "email");

    if (!contact) {
        throw HttpError(404, 'Not found');
    }

    res.json(contact);
}

const addContacts = async (req, res, next) => {
    const { id: owner } = req.user;
    const contact = await Contact.create({...req.body, owner});
    res.status(201).json(contact);
}

const updateContactsById = async (req, res, next) => {
    const id = req.params.contactId;
    const { id: owner } = req.user;

    const result = await Contact.findById({_id: id, owner});

    if(!result) {
        throw HttpError(404, 'Not found')
    }

    const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if(!contact) {
        throw HttpError(404, 'Not found')
    }
    
    res.status(201).json(contact);
}

const updateFavorite = async (req, res) => {
    const id = req.params.contactId;
    const { id: owner } = req.user;

    const contact = await Contact.updateOne({_id: id, owner}, req.body, { new: true });

    if(contact.modifiedCount === 0) {
        throw HttpError(404, 'Not found')
    }
    const result = await Contact.findById(id);
    
    res.status(201).json(result);
}

const deletContactsById = async (req, res, next) => {
    const id = req.params.contactId;
    const { id: owner } = req.user;
    const contact = await Contact.deleteOne({_id: id, owner});

    if(contact.deletedCount === 0) {
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
    updateFavorite: ctrlWrapper(updateFavorite),
    deletContactsById: ctrlWrapper(deletContactsById),
}