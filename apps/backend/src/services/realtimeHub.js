const MAX_BUFFER = 200;

const clients = new Set();
const eventBuffer = [];
let eventId = 0;

function createEvent(type, data) {
  eventId += 1;
  return {
    id: String(eventId),
    type,
    data,
    timestamp: new Date().toISOString(),
  };
}

function rememberEvent(event) {
  eventBuffer.push(event);
  if (eventBuffer.length > MAX_BUFFER) {
    eventBuffer.shift();
  }
}

function writeEvent(res, event) {
  res.write(`id: ${event.id}\n`);
  res.write(`event: ${event.type}\n`);
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

function publish(type, data) {
  const event = createEvent(type, data);
  rememberEvent(event);

  for (const client of clients) {
    writeEvent(client, event);
  }

  return event;
}

function replayAfter(lastEventId) {
  if (!lastEventId) {
    return eventBuffer;
  }
  const id = Number(lastEventId);
  if (Number.isNaN(id)) {
    return eventBuffer;
  }
  return eventBuffer.filter((event) => Number(event.id) > id);
}

function subscribe(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.add(res);
  res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);

  const replayEvents = replayAfter(req.headers["last-event-id"]);
  replayEvents.forEach((event) => writeEvent(res, event));

  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
}

function listRecentEvents() {
  return [...eventBuffer];
}

module.exports = {
  publish,
  subscribe,
  listRecentEvents,
};
