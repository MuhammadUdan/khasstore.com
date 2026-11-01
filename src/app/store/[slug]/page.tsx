
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 3499,
    oldPrice: 4999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  },
  {
    id: 2,
    name: "Premium Smart Watch",
    price: 5499,
    oldPrice: 6999,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  },
  {
    id: 3,
    name: "Modern Wireless Speaker",
    price: 2799,
    oldPrice: 3999,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
  },
  {
    id: 4,
    name: "Minimal Desk Accessories",
    price: 1899,
    oldPrice: 2499,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600",
  },
];

export default function StorefrontPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Top Bar */}
      <div className="bg-[#10264b] px-5 py-2 text-center text-sm text-white">
        Secure Payments | Easy Returns
      </div>

      {/* Main Navigation */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-2xl font-extrabold text-[#163b75]">
            KhasStore<span className="text-blue-500">.com</span>
          </Link>

          <div className="hidden flex-1 items-center rounded-xl border bg-slate-50 px-4 py-3 md:flex md:max-w-xl">
            <Search size={19} className="text-slate-400" />
            <input
              placeholder="Search products on KhasStore..."
              className="ml-3 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-slate-700">
            <span className="hidden text-sm font-medium sm:block">
              My Account
            </span>
            <ShoppingCart size={23} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6">

        {/* Back to Marketplace */}
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={17} />
          Back to KhasStore Marketplace
        </Link>

        {/* Store Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2458a2]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-10 -top-20 h-80 w-80 rounded-full border-[40px] border-white" />
            <div className="absolute right-40 top-20 h-48 w-48 rounded-full border-[25px] border-white" />
          </div>

          <div className="relative px-7 py-14 text-white md:px-12">
            <p className="mb-3 text-sm font-medium text-blue-200">
              WELCOME TO OUR STORE
            </p>
            <h1 className="text-3xl font-extrabold md:text-5xl">
              Ali Electronics
            </h1>
            <p className="mt-3 max-w-xl text-sm text-blue-100 md:text-base">
              Discover quality electronics, smart gadgets and everyday
              technology at great prices.
            </p>
          </div>
        </section>

        {/* Store Information */}
        <section className="relative -mt-7 mx-3 rounded-2xl border bg-white p-5 shadow-sm md:mx-7 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#163b75]">
              <Store size={34} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">Ali Electronics</h2>
                <BadgeCheck size={19} className="text-blue-600" />
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                  Verified Seller
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> Karachi, Pakistan
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  4.8 Store Rating
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-7 border-t pt-4 md:mt-0 md:border-0 md:pt-0">
            <div>
              <p className="text-xl font-bold">120+</p>
              <p className="text-xs text-slate-500">Products</p>
            </div>
            <div>
              <p className="text-xl font-bold">4.8/5</p>
              <p className="text-xs text-slate-500">Rating</p>
            </div>
            <div>
              <p className="text-xl font-bold">2 Years</p>
              <p className="text-xs text-slate-500">On KhasStore</p>
            </div>
          </div>
        </section>

        {/* Store Navigation */}
        <nav className="mt-8 flex gap-7 overflow-x-auto border-b text-sm font-semibold">
          <button className="whitespace-nowrap border-b-2 border-blue-700 pb-3 text-blue-700">
            All Products
          </button>
          <button className="whitespace-nowrap pb-3 text-slate-500 hover:text-blue-700">
            Electronics
          </button>
          <button className="whitespace-nowrap pb-3 text-slate-500 hover:text-blue-700">
            Accessories
          </button>
          <button className="whitespace-nowrap pb-3 text-slate-500 hover:text-blue-700">
            About Store
          </button>
        </nav>

        {/* Products Heading */}
        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Store Products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Explore products from Ali Electronics
              </p>
            </div>

            <select className="rounded-lg border bg-white px-3 py-2 text-sm outline-none">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-44 w-full object-cover md:h-56"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-blue-700 shadow-sm">
                    Verified Seller
                  </span>
                </div>

                <div className="p-3 md:p-4">
                  <div className="mb-2 flex items-center gap-1 text-xs text-amber-500">
                    <Star size={13} className="fill-current" />
                    {product.rating}
                  </div>

                  <h3 className="min-h-10 text-sm font-semibold leading-5">
                    {product.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#163b75]">
                      Rs. {product.price.toLocaleString("en-PK")}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      Rs. {product.oldPrice.toLocaleString("en-PK")}
                    </span>
                  </div>

                  <button className="mt-4 w-full rounded-lg bg-[#163b75] py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
                    View Product
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Store Footer */}
        <footer className="mt-16 rounded-2xl bg-[#10264b] px-6 py-8 text-center text-white">
          <Package size={30} className="mx-auto mb-3 text-blue-300" />
          <h3 className="text-xl font-bold">Shop with Confidence</h3>
          <p className="mt-2 text-sm text-blue-100">
            Discover trusted sellers and quality products on KhasStore.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#163b75] hover:bg-blue-50"
          >
            Explore KhasStore
          </Link>
        </footer>

      </div>
    </main>
  );
}
