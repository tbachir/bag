import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">BAG — Your Developer's Inventory</h1>
      <p>Tools, knowledge, and reusable workflows for your next development quest.</p>
      <Link href="/docs/" className="font-medium underline underline-offset-4">
        Explore the documentation
      </Link>
    </main>
  );
}
