const express = require('express');
const { getContacts, getContactsById, addContacts, updateContactsById, deletContactsById } = require('../../controllers/contactsController');
const validateBody = require('../../utils/validateBody');
const { contactAddSchema, contactUpdateSchema } = require('../../services/validateSchema');

const router = express.Router();

router.get('/', getContacts);

router.get('/:contactId', getContactsById);

router.post('/', validateBody(contactAddSchema), addContacts);

router.delete('/:contactId', deletContactsById)

router.put('/:contactId', validateBody(contactUpdateSchema), updateContactsById)

module.exports = router;