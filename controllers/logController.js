
const Log = require('../models/logModel');
const Device = require('../models/deviceModel');

/**
 * Add a log entry for a device.
 * Checks that the device belongs to the authenticated user.
 * Expects: req.body.device, req.body.event, req.body.value
 */
exports.addLogEntry = async (req, res) => {
  try {
    // deviceId should be in req.params.id
    const deviceId = req.params.id;
    const { event, value } = req.body;
    const userId = req.user.userId;
    // Check that device belongs to user using owner_id
    const deviceObj = await Device.findOne({ _id: deviceId, owner_id: userId });
    if (!deviceObj) {
      return res.status(403).json({ error: 'Device not found or not owned by user.' });
    }
    // Create log entry, set device to deviceId
    const log = await Log.create({
      device: deviceId,
      event,
      value,
      timestamp: new Date()
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get the most recent N logs for a device owned by the authenticated user.
 * Uses ?limit= param, defaults to 10.
 * Expects: req.params.deviceId
 */
exports.getLogs = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 10;
    const userId = req.user.userId;
    // Check that device belongs to user using owner_id
    const deviceObj = await Device.findOne({ _id: deviceId, owner_id: userId });
    if (!deviceObj) {
      return res.status(403).json({ error: 'Device not found or not owned by user.' });
    }
    // Find logs
    const logs = await Log.find({ device: deviceId })
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Aggregate log usage for a device owned by the authenticated user in a time range.
 * Query params: from, to (ISO string), default to last 24h. Sums the 'value' field.
 * Expects: req.params.deviceId
 */
exports.getUsage = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const userId = req.user.userId;
    // Check that device belongs to user using owner_id
    const deviceObj = await Device.findOne({ _id: deviceId, owner_id: userId });
    if (!deviceObj) {
      return res.status(403).json({ error: 'Device not found or not owned by user.' });
    }
    let from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    let to = req.query.to ? new Date(req.query.to) : new Date();
    // Aggregate total value in range
    const result = await Log.aggregate([
      {
        $match: {
          device: deviceObj._id,
          timestamp: { $gte: from, $lte: to }
        }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' }
        }
      }
    ]);
    const totalValue = result.length > 0 ? result[0].totalValue : 0;
    res.json({ device: deviceId, from, to, totalValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};