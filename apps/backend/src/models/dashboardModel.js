const { prisma } = require("../config/database");

async function getUserDashboard(userId) {
  const normalizedUserId = Number(userId);

  const [orderCount, totalSpendAgg, recentOrders, groupedStatuses] =
    await Promise.all([
      prisma.order.count({ where: { userId: normalizedUserId } }),
      prisma.order.aggregate({
        where: {
          userId: normalizedUserId,
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { userId: normalizedUserId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: { userId: normalizedUserId },
        _count: { _all: true },
      }),
    ]);

  return {
    summary: {
      totalOrders: orderCount,
      paidTotal: Number(totalSpendAgg._sum.total || 0),
    },
    orderStatusBreakdown: groupedStatuses.map((entry) => ({
      status: entry.status,
      count: entry._count._all,
    })),
    recentOrders,
  };
}

async function getAdminDashboard() {
  const [usersCount, ordersCount, paidRevenueAgg, recentOrders, statusBreakdown] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          items: true,
          user: {
            select: { id: true, email: true, name: true, role: true },
          },
        },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

  return {
    summary: {
      users: usersCount,
      orders: ordersCount,
      paidRevenue: Number(paidRevenueAgg._sum.total || 0),
    },
    orderStatusBreakdown: statusBreakdown.map((entry) => ({
      status: entry.status,
      count: entry._count._all,
    })),
    recentOrders,
  };
}

module.exports = {
  getUserDashboard,
  getAdminDashboard,
};
