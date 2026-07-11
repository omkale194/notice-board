import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import prisma from "../lib/prisma";
import NoticeCard from "../components/NoticeCard";

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  // Guarantee Urgent-first ordering explicitly, independent of enum
  // declaration order, then serialize dates for JSON transport.
  const sorted = [...notices].sort((a, b) => {
    if (a.priority === b.priority) return 0;
    return a.priority === "Urgent" ? -1 : 1;
  });

  const serialized = sorted.map((n) => ({
    ...n,
    publishDate: n.publishDate.toISOString(),
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }));

  return { props: { initialNotices: serialized } };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);

  async function handleDelete(id) {
    const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } else {
      alert("Failed to delete notice. Please try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notice Board</h1>
            <p className="text-sm text-slate-500">
              {notices.length} notice{notices.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href="/notices/new"
            className="inline-flex w-fit items-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            + Add Notice
          </Link>
        </div>

        {notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No notices yet. Click "Add Notice" to create the first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
