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
  await prisma.$transaction(async (tx) => {
    for (const group of duplicateGroups) {
      const rows = await tx.menu.findMany({
        where: { name: group.name },
        orderBy: [
          { updatedAt: "desc" },
          { createdAt: "desc" },
          { id: "desc" },
        ],
        select: { id: true },
      });

      const removeIds = rows.slice(1).map((r) => r.id);
      if (removeIds.length === 0) {
        continue;
      }

      const res = await tx.menu.deleteMany({
        where: { id: { in: removeIds } },
      });
      deletedTotal += res.count;
    }
  });

  console.log(`\nDeleted duplicate rows: ${deletedTotal}`);
}

main()
  .catch((err) => {
    console.error("Failed to dedupe menu:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
