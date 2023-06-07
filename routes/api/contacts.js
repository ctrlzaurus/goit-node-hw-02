const express = require('express');
const { getContacts, getContactsById, addContacts, updateContactsById, deletContactsById, updateFavorite } = require('../../controllers/contactsController');
const validateBody = require('../../utils/validateBody');
const { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } = require('../../services/validateSchema');
const isValidId = require('../../middlewares/isValidId');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/', getContacts);

router.get('/:contactId', isValidId, getContactsById);

router.post('/', validateBody(contactAddSchema), addContacts);

router.delete('/:contactId', isValidId, deletContactsById);

router.put('/:contactId', isValidId, validateBody(contactUpdateSchema), updateContactsById);

router.patch('/:contactId/favorite', isValidId, validateBody(contactUpdateFavoriteSchema), updateFavorite);

module.exports = router;