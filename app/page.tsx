import Link from "next/link";
import { ArrowRight, BadgeCheck, RefreshCcw, SearchCheck, Sparkles, Truck } from "lucide-react";
import HomeSearch from "@/components/home/HomeSearch";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ProductCard from "@/components/products/ProductCard";
import ProductImage from "@/components/products/ProductImage";
import { getCategories, getProducts } from "@/lib/products/product-service";

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const offers = products.filter((product) => product.originalPrice && product.originalPrice > product.price).slice(0, 4);
  const heroProduct = products.find((product) => product.id === "sony-wh-1000xm5") ?? featured[0];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
      <section className="relative mt-5 overflow-hidden rounded-[2rem] bg-[#171a2b] text-white shadow-card sm:mt-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(129,140,248,.38),transparent_38%),radial-gradient(circle_at_95%_92%,rgba(217,70,239,.2),transparent_34%)]" />
        <div className="relative grid grid-cols-1 items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_.9fr] lg:px-14 lg:py-16">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
              A customer storefront experience
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Find the right things for <span className="text-indigo-300">everyday life.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Explore a considered demo catalog with category-specific details, useful product choices and a clear path from discovery to checkout.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-indigo-50">
                Browse the catalog <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a href="#categories" className="inline-flex h-12 items-center rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Explore categories</a>
            </div>
            <p className="mt-5 text-xs leading-5 text-white/55">{products.length} sample products across {categories.length} categories · no live inventory or payments</p>
          </div>
          <div className="relative mx-auto w-full max-w-md min-w-0">
            <div className="absolute -inset-4 rounded-[2rem] bg-indigo-400/20 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="relative aspect-[1.12] overflow-hidden rounded-[1.25rem] bg-slate-900">
                <ProductImage src={heroProduct.images[0]} alt={heroProduct.name} loading="eager" sizes="(min-width: 1024px) 34vw, 85vw" />
              </div>
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
                <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wider text-white/55">{heroProduct.brand}</p><p className="mt-1 truncate font-semibold">{heroProduct.name}</p></div>
                <Link href={`/products/${heroProduct.slug}`} aria-label={`View ${heroProduct.name}`} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition hover:scale-105"><ArrowRight className="size-4" aria-hidden="true" /></Link>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl sm:flex">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300"><BadgeCheck className="size-4" aria-hidden="true" /></span>
              <span><span className="block text-xs font-semibold">Clear product choices</span><span className="block text-[10px] text-white/55">Variants and details up front</span></span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Search catalog" className="relative z-10 mx-auto -mt-5 max-w-4xl px-3 sm:-mt-6 sm:px-8">
        <HomeSearch />
      </section>

      <section id="categories" aria-labelledby="categories-heading" className="scroll-mt-24 pt-14">
        <SectionHeading eyebrow="A world of choice" title="Shop by category" description="Each department brings its own relevant product details and filters." link="/products" linkLabel="View all products" />
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => {
            const count = products.filter((product) => product.categoryId === category.id).length;
            return (
              <li key={category.id}>
                <Link href={`/products?category=${category.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  <div className="relative aspect-[1.35] overflow-hidden bg-surface-sunken">
                    <ProductImage src={category.image} alt="" sizes="(min-width: 1024px) 23vw, 46vw" className="transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2 p-3 sm:p-4">
                    <span><span className="block text-sm font-semibold sm:text-base">{category.name}</span><span className="mt-1 block text-xs text-fg-subtle">{count} sample {count === 1 ? "product" : "products"}</span></span>
                    <ArrowRight className="size-4 shrink-0 text-fg-subtle transition group-hover:translate-x-1 group-hover:text-accent-ink" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <ProductSection id="featured" eyebrow="Picked for you" title="Featured finds" description="A curated starting point for exploring the catalog." products={featured} />
      <ProductSection id="offers" eyebrow="Worth a closer look" title="Current demo offers" description="Sample markdown pricing to show sale and original-price states." products={offers} />
      <ProductSection id="new" eyebrow="Just added" title="New arrivals" description="Recently added pieces from across the demo departments." products={newArrivals} />

      <section aria-labelledby="promise-heading" className="mt-16 rounded-3xl border border-line bg-surface p-6 sm:p-9">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-accent-ink">Designed around the customer</p><h2 id="promise-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">A more considered way to shop.</h2><p className="mt-3 text-sm leading-6 text-fg-muted">This frontend demo shows how product discovery, variants, cart and orders fit together—without implying that service integrations are already live.</p></div>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<SearchCheck className="size-5" aria-hidden="true" />} title="Relevant discovery" description="Category-specific filters make it easier to find a useful match." />
          <Feature icon={<BadgeCheck className="size-5" aria-hidden="true" />} title="Product clarity" description="Important details and options are presented before adding to cart." />
          <Feature icon={<Truck className="size-5" aria-hidden="true" />} title="Delivery choices" description="Checkout explains sample delivery options and totals up front." />
          <Feature icon={<RefreshCcw className="size-5" aria-hidden="true" />} title="Transparent demo" description="Sample data is labeled; no payment or backend request is performed." />
        </ul>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHeading({
  headingId,
  eyebrow,
  title,
  description,
  link,
  linkLabel,
}: {
  headingId?: string;
  eyebrow: string;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-accent-ink">{eyebrow}</p><h2 id={headingId} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-fg-muted">{description}</p></div>
      {link && <Link href={link} className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-accent-ink hover:underline">{linkLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link>}
    </div>
  );
}

function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Awaited<ReturnType<typeof getProducts>>;
}) {
  if (products.length === 0) return null;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-16 scroll-mt-24">
      <SectionHeading headingId={`${id}-heading`} eyebrow={eyebrow} title={title} description={description} link="/products" linkLabel="Explore catalog" />
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => <li key={product.id} className="flex min-w-0"><ProductCard product={product} /></li>)}
      </ul>
    </section>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <li className="rounded-2xl border border-line bg-surface-muted p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">{icon}</span><h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-fg-muted">{description}</p></li>;
}
