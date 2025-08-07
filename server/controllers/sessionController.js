const { validationResult } = require('express-validator');
const Session = require('../models/sessionModel');
const { asyncHandler } = require('../utils/asyncHandler');

// GET /api/sessions - Public published sessions
const getAllSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ status: 'published' }).populate('user', 'name');
  res.json({ status: 'success', data: sessions });
});

// GET /api/my-sessions - User's own sessions
const getMySessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user.id });
  // console.log("Session issss: ",sessions)
  res.json({ status: 'success', data: sessions });
});

// GET /api/my-sessions/:id - View single user session
const getSingleSession = asyncHandler(async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user: req.user.id });
  if (!session) {
    return res.status(404).json({ status: 'error', message: 'Session not found' });
  }
  res.json({ status: 'success', data: session });
});

// POST /api/my-sessions/save-draft - Save or update draft
const saveDraftSession = asyncHandler(async (req, res) => {
  const { id, title, tags, jsonUrl } = req.body;

  let session;
  if (id) {
    session = await Session.findOne({ _id: id, user: req.user.id });
    if (!session) {
      return res.status(404).json({ status: 'error', message: 'Session not found' });
    }
    session.title = title;
    session.tags = tags;
    session.jsonUrl = jsonUrl;
    if (!session.status) {
  session.status = 'draft';
}
    await session.save();
  } else {
    session = await Session.create({
      title,
      tags,
      jsonUrl,
      user: req.user.id,
      status: 'draft',
    });
  }

  res.status(200).json({ status: 'success', data: session });
});

// POST /api/my-sessions/publish - Publish session
const publishSession = async (req, res) => {
  try {
    const sessionId = req.body.id;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (session.status === 'published') {
      return res.status(400).json({ message: 'Session already published' });
    }

    session.status = 'published';
    console.log('status is ', session.status);
    await session.save();

    return res.status(200).json({ message: 'Session published successfully' });
  } catch (err) {
    console.error('Error publishing session:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  getAllSessions,
  getMySessions,
  getSingleSession,
  saveDraftSession,
  publishSession,
};
