const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.addUser);
router.post('/:id/claim', userController.claimPoints);
router.get('/leaderboard/all', userController.getLeaderboard);
router.get('/:id/history', userController.getClaimHistory);
router.delete('/:id', userController.deleteUser);

module.exports = router;
