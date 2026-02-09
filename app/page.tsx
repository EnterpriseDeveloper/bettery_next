import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Here is my new app</p>
      <Link
        href="/app"
        className="text-sm font-semibold leading-6 text-gray-900"
      >
        Home
      </Link>
    </div>
  );
}
