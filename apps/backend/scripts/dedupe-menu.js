require("dotenv").config();
const { prisma } = require("../src/config/database");

function parseArgs(argv) {
  return {
    apply: argv.includes("--apply"),
  };
}

async function findDuplicateGroups() {
  return prisma.menu.groupBy({
    by: ["name"],
    _count: { name: true },
    having: {
      name: {
        _count: {
          gt: 1,
        },
      },
    },
    orderBy: {
      _count: {
        name: "desc",
      },
    },
  });
}

async function getRowsForName(name) {
  return prisma.menu.findMany({
    where: { name },
    orderBy: [
      { updatedAt: "desc" },
      { createdAt: "desc" },
      { id: "desc" },
    ],
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      image: true,
      isAvailable: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function remapCartItems(tx, fromMenuId, toMenuId) {
  const duplicateItems = await tx.cartItem.findMany({
    where: { menuId: fromMenuId },
    select: {
      id: true,
      cartId: true,
      quantity: true,
      subtotal: true,
    },
  });

  for (const item of duplicateItems) {
    const existing = await tx.cartItem.findUnique({
      where: {
        cartId_menuId: {
          cartId: item.cartId,
          menuId: toMenuId,
        },
      },
      select: {
        id: true,
        quantity: true,
        subtotal: true,
      },
    });

    if (existing) {
      // Merge duplicate cart lines to satisfy @@unique([cartId, menuId]).
      await tx.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + item.quantity,
          subtotal: Number(existing.subtotal) + Number(item.subtotal),
        },
      });

      await tx.cartItem.delete({ where: { id: item.id } });
    } else {
      await tx.cartItem.update({
        where: { id: item.id },
        data: { menuId: toMenuId },
      });
    }
  }
}

async function remapOrderItems(tx, fromMenuId, toMenuId) {
  // order_items keep menuName/unitPrice snapshots, but menuId is still useful for analytics.
  await tx.orderItem.updateMany({
    where: { menuId: fromMenuId },
    data: { menuId: toMenuId },
  });
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));

  const duplicateGroups = await findDuplicateGroups();
  if (duplicateGroups.length === 0) {
    console.log("No duplicate menu names found.");
    return;
  }

  let totalDuplicates = 0;
  let totalDeleteCandidates = 0;

  console.log(`Duplicate name groups: ${duplicateGroups.length}`);
  for (const group of duplicateGroups) {
    totalDuplicates += group._count.name;
    totalDeleteCandidates += group._count.name - 1;

    const rows = await getRowsForName(group.name);
    const keep = rows[0];
    const remove = rows.slice(1);

    console.log(`\nName: ${group.name}`);
    console.log(`Count: ${group._count.name}`);
    console.log(`Keep id: ${keep.id}`);
    console.log(`Delete ids: ${remove.map((r) => r.id).join(", ")}`);
  }

  console.log("\nSummary:");
  console.log(`Rows inside duplicate groups: ${totalDuplicates}`);
  console.log(`Rows that would be deleted: ${totalDeleteCandidates}`);

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to delete duplicate rows.");
    return;
  }

  let deletedTotal = 0;
  let cartItemsRemapped = 0;
  let orderItemsRemapped = 0;
  for (const group of duplicateGroups) {
    await prisma.$transaction(async (tx) => {
      const rows = await tx.menu.findMany({
        where: { name: group.name },
        orderBy: [
          { updatedAt: "desc" },
          { createdAt: "desc" },
          { id: "desc" },
        ],
        select: { id: true },
      });

      const keepId = rows[0].id;
      const removeIds = rows.slice(1).map((r) => r.id);
      if (removeIds.length === 0) {
        return;
      }

      for (const removeId of removeIds) {
        const cartCount = await tx.cartItem.count({ where: { menuId: removeId } });
        const orderCount = await tx.orderItem.count({ where: { menuId: removeId } });

        await remapCartItems(tx, removeId, keepId);
        await remapOrderItems(tx, removeId, keepId);

        cartItemsRemapped += cartCount;
        orderItemsRemapped += orderCount;
      }

      const res = await tx.menu.deleteMany({
        where: { id: { in: removeIds } },
      });
      deletedTotal += res.count;
    }, { timeout: 60000, maxWait: 10000 });
  }

  console.log(`\nDeleted duplicate rows: ${deletedTotal}`);
  console.log(`Cart items remapped: ${cartItemsRemapped}`);
  console.log(`Order items remapped: ${orderItemsRemapped}`);
}

main()
  .catch((err) => {
    console.error("Failed to dedupe menu:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
