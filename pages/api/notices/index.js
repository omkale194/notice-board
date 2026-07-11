import prisma from "../../../lib/prisma";
import { validateNotice } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        // Urgent-first ordering is done here, in the database query,
        // not by sorting an array in the browser.
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });
      // Prisma/MySQL order enum values by their declaration order in the
      // schema (Normal, Urgent), so "desc" already puts Urgent first.
      // We still apply an explicit priority sort below as a safety net,
      // so correctness never depends on enum declaration order.
      const sorted = [...notices].sort((a, b) => {
        if (a.priority === b.priority) return 0;
        return a.priority === "Urgent" ? -1 : 1;
      });
      return res.status(200).json(sorted);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notices." });
    }
  }

  if (req.method === "POST") {
    const result = validateNotice(req.body);
    if (!result.valid) {
      return res.status(400).json({ errors: result.errors });
    }

    try {
      const notice = await prisma.notice.create({ data: result.data });
      return res.status(201).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
