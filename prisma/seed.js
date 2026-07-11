const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.notice.createMany({
    data: [
      {
        title: "Mid-term Exam Schedule Released",
        body: "The mid-term examination schedule for all departments has been published. Please check your respective portals.",
        category: "Exam",
        priority: "Urgent",
        publishDate: new Date(),
      },
      {
        title: "Annual Sports Day",
        body: "Annual sports day will be held on the main ground. All students are encouraged to participate.",
        category: "Event",
        priority: "Normal",
        publishDate: new Date(),
      },
      {
        title: "Library Timings Updated",
        body: "The library will now remain open until 9 PM on weekdays.",
        category: "General",
        priority: "Normal",
        publishDate: new Date(),
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
