import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialNotice, noticeId }) {
  const router = useRouter();
  const isEditing = Boolean(noticeId);

  const [title, setTitle] = useState(initialNotice?.title || "");
  const [body, setBody] = useState(initialNotice?.body || "");
  const [category, setCategory] = useState(initialNotice?.category || "General");
  const [priority, setPriority] = useState(initialNotice?.priority || "Normal");
  const [publishDate, setPublishDate] = useState(
    toDateInputValue(initialNotice?.publishDate) || toDateInputValue(new Date())
  );
  const [image, setImage] = useState(initialNotice?.image || "");
  const [imagePreview, setImagePreview] = useState(initialNotice?.image || "");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function clientSideErrors() {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (!body.trim()) errs.body = "Body is required.";
    if (!publishDate || Number.isNaN(new Date(publishDate).getTime())) {
      errs.publishDate = "A valid publish date is required.";
    }
    return errs;
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const clientErrors = clientSideErrors();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = { title, body, category, priority, publishDate, image };

    try {
      const res = await fetch(
        isEditing ? `/api/notices/${noticeId}` : "/api/notices",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || "Something went wrong. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitError && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Mid-term exam schedule released"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Full details of the notice…"
        />
        {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Publish date</label>
        <input
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {errors.publishDate && (
          <p className="mt-1 text-xs text-red-600">{errors.publishDate}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Image <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 h-32 w-full max-w-xs rounded-lg object-cover"
          />
        )}
        {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEditing ? "Save changes" : "Create notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
