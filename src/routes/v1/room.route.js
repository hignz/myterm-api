const express = require('express');
const roomScraper = require('../../utils/roomScraper');

const router = express.Router();

router.get('/rooms/:type?', async (req, res) => {
  try {
    const roomType = req.query.type === '1' ? '1' : '0';
    const data = await roomScraper(roomType);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: 'An error occured',
    });
  }
});

module.exports = router;