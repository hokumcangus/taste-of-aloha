const realtimeHub = require("../services/realtimeHub");

function stream(req, res) {
  realtimeHub.subscribe(req, res);
}

function listEvents(_req, res) {
  res.json(realtimeHub.listRecentEvents());
}

module.exports = {
  stream,
  listEvents,
};
