import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Link href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Login
    </Link>
  );
}
