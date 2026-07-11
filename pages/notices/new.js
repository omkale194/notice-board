import Head from "next/head";
import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>Add Notice · Notice Board</title>
      </Head>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
          ← Back to notices
        </Link>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-bold text-slate-900">Add Notice</h1>
          <NoticeForm />
        </div>
      </main>
    </>
  );
}
