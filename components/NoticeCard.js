import { useState } from "react";
import Link from "next/link";

const CATEGORY_STYLES = {
  Exam: "bg-blue-100 text-blue-700",
  Event: "bg-emerald-100 text-emerald-700",
  General: "bg-slate-200 text-slate-700",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NoticeCard({ notice, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmedDelete() {
    setDeleting(true);
    try {
      await onDelete(notice.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div
      className={`relative rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        notice.priority === "Urgent" ? "border-red-300" : "border-slate-200"
      }`}
    >
      {notice.priority === "Urgent" && (
        <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
          Urgent
        </span>
      )}

      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="mb-3 h-36 w-full rounded-lg object-cover"
        />
      )}

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General
          }`}
        >
          {notice.category}
        </span>
        <span className="text-xs text-slate-500">{formatDate(notice.publishDate)}</span>
      </div>

      <h3 className="mb-1 text-lg font-semibold text-slate-900">{notice.title}</h3>
      <p className="mb-4 whitespace-pre-wrap text-sm text-slate-600 line-clamp-4">
        {notice.body}
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Edit
        </Link>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-2 py-1">
            <span className="text-xs text-red-700">Delete this notice?</span>
            <button
              onClick={handleConfirmedDelete}
              disabled={deleting}
              className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
