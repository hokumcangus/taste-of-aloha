const notificationModel = require("../models/notificationModel");

async function listMyNotifications(req, res) {
  try {
    const notifications = await notificationModel.listNotificationsForUser(
      req.user.id,
      req.query.limit,
    );

    const unreadCount = notifications.reduce(
      (count, entry) => count + (entry.isRead ? 0 : 1),
      0,
    );

    return res.json({ notifications, unreadCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

async function markOneRead(req, res) {
  try {
    const changed = await notificationModel.markNotificationRead(
      req.params.id,
      req.user.id,
    );

    if (!changed) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update notification" });
  }
}

async function markAllRead(req, res) {
  try {
    const updatedCount = await notificationModel.markAllNotificationsRead(req.user.id);
    return res.json({ success: true, updatedCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update notifications" });
  }
}

module.exports = {
  listMyNotifications,
  markOneRead,
  markAllRead,
};
