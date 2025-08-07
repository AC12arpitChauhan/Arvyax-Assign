const express = require('express');
const { body } = require('express-validator');
const {
  getAllSessions,
  getMySessions,
  getSingleSession,
  saveDraftSession,
  publishSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/sessions', getAllSessions);
router.get('/my-sessions', protect, getMySessions);
router.get('/my-sessions/:id', protect, getSingleSession);

router.post(
  '/my-sessions/save-draft',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('jsonUrl').isURL().withMessage('Valid JSON URL is required'),
    body('tags').isArray().optional(),
  ],
  saveDraftSession
);

router.post('/my-sessions/publish', protect, publishSession);

module.exports = router;
