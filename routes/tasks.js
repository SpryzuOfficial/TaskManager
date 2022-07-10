const { Router } = require('express');
const { check } = require('express-validator');

const { addTask, checkTask, getTasks, editTask, deleteTask } = require('../controllers/tasks');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.get('/', getTasks);

router.post('/add', [
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], addTask);

router.put('/check', [
    check('id', 'Id is required').not().isEmpty(),
    validateFields
], checkTask);

router.put('/edit', [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('id', 'Id is required').not().isEmpty(),
    validateFields
], editTask);

router.delete('/delete', [
    check('id', 'Id is required').not().isEmpty(),
    validateFields
], deleteTask);

module.exports = router;