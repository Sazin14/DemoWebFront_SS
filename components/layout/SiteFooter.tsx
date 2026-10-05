import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} EcomMS. All rights reserved.</p>
        <p>
          Demo storefront: products, prices and cart are sample data.{" "}
          <Link href="/products" className="font-medium text-indigo-600 hover:underline">
            Browse products
          </Link>
        </p>
      </div>
    </footer>
  );
}
