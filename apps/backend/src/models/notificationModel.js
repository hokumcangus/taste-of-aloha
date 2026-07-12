const { prisma } = require("../config/database");

async function listNotificationsForUser(userId, limit = 30) {
  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);

  return prisma.notification.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
    take: safeLimit,
    include: {
      order: {
        select: {
          id: true,
          status: true,
          total: true,
          assignedDriverId: true,
        },
      },
    },
  });
}

async function markNotificationRead(notificationId, userId) {
  const updated = await prisma.notification.updateMany({
    where: {
      id: Number(notificationId),
      userId: Number(userId),
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return updated.count > 0;
}

async function markAllNotificationsRead(userId) {
  const updated = await prisma.notification.updateMany({
    where: {
      userId: Number(userId),
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return updated.count;
}

async function createOrderNotifications({
  order,
  type,
  title,
  message,
  includeCustomer = true,
  includeAdmins = true,
  includeDrivers = false,
  includeAssignedDriver = true,
}) {
  if (!order?.id || !type || !title || !message) {
    return 0;
  }

  const recipientIds = new Set();

  if (includeCustomer && order.userId) {
    recipientIds.add(Number(order.userId));
  }

  if (includeAssignedDriver && order.assignedDriverId) {
    recipientIds.add(Number(order.assignedDriverId));
  }

  if (includeAdmins || includeDrivers) {
    const roles = [];
    if (includeAdmins) {
      roles.push("ADMIN");
    }
    if (includeDrivers) {
      roles.push("DRIVER");
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: roles },
      },
      select: { id: true },
    });

    for (const user of users) {
      recipientIds.add(Number(user.id));
    }
  }

  if (recipientIds.size === 0) {
    return 0;
  }

  const rows = Array.from(recipientIds).map((recipientId) => ({
    userId: recipientId,
    orderId: Number(order.id),
    type,
    title,
    message,
  }));

  const created = await prisma.notification.createMany({
    data: rows,
  });

  return created.count;
}

module.exports = {
  listNotificationsForUser,
  markNotificationRead,
  markAllNotificationsRead,
  createOrderNotifications,
};
