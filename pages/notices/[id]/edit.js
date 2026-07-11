import Head from "next/head";
import Link from "next/link";
import prisma from "../../../lib/prisma";
import NoticeForm from "../../../components/NoticeForm";

export async function getServerSideProps({ params }) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    },
  };
}

export default function EditNotice({ notice }) {
  return (
    <>
      <Head>
        <title>Edit Notice · Notice Board</title>
      </Head>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
          ← Back to notices
        </Link>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-bold text-slate-900">Edit Notice</h1>
          <NoticeForm initialNotice={notice} noticeId={notice.id} />
        </div>
      </main>
    </>
  );
}
