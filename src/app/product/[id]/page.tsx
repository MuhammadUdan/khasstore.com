"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  Store,
  CheckCircle,
  Package,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type Product = {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
};

type Seller = {
  shop_name: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  seller_id: string;
  seller_name: string;
  store_slug: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPKR(amount: number) {
  return Number(amount || 0).toLocaleString("en-PK");
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id || "");
  const supabase = useMemo(() => createClient(), []);

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [cartMessage, setCartMessage] = useState("");

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          "id, seller_id, name, description, price, stock, category, image_url"
        )
        .eq("id", id)
        .eq("status", "active")
        .maybeSingle();

      if (productError) throw productError;

      if (!productData) {
        setProduct(null);
        setSeller(null);
        return;
      }

      const { data: sellerData, error: sellerError } = await supabase
        .from("seller_applications")
        .select("shop_name")
        .eq("user_id", productData.seller_id)
        .eq("status", "approved")
        .maybeSingle();

      if (sellerError) throw sellerError;

      if (!sellerData) {
        setProduct(null);
        setSeller(null);
        return;
      }

      setProduct(productData);
      setSeller(sellerData);
      setQuantity(1);
    } catch (err) {
      console.error("Product details error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Product load nahi ho saka. Dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const storeSlug = seller ? slugify(seller.shop_name) : "";

  const addToCart = () => {
    if (!product || !seller) return false;

    if (product.stock <= 0) {
      setCartMessage("Ye product abhi out of stock hai.");
      return false;
    }

    try {
      const savedCart = localStorage.getItem("khasstore-cart");
      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const existingItem = cart.find(
        (item) => item.id === product.id
      );

      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                seller_id: product.seller_id,
                seller_name: seller.shop_name,
                store_slug: storeSlug,
                quantity: Math.min(
                  Number(item.quantity || 0) + quantity,
                  product.stock
                ),
              }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image_url || "",
            quantity,
            seller_id: product.seller_id,
            seller_name: seller.shop_name,
            store_slug: storeSlug,
          },
        ];
      }

      localStorage.setItem(
        "khasstore-cart",
        JSON.stringify(updatedCart)
      );

      setCartMessage(`${quantity} item(s) cart mein add ho gaye!`);
      return true;
    } catch (err) {
      console.error("Cart error:", err);
      setCartMessage("Cart save nahi ho saka. Dobara try karein.");
      return false;
    }
  };

  const handleBuyNow = () => {
    const added = addToCart();

    if (added) {
      router.push("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-semibold text-gray-600">
          Product loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-center text-red-600">{error}</p>

        <button
          onClick={loadProduct}
          className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
          <Package size={42} className="mx-auto text-gray-300 mb-4" />

          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            Ye product available nahi hai ya seller approved nahi hai.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            <ArrowLeft size={18} />
            Back to KhasStore
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          <ChevronRight size={15} />

          <Link
            href={`/store/${storeSlug}`}
            className="hover:text-blue-600"
          >
            {seller.shop_name}
          </Link>

          <ChevronRight size={15} />

          <span className="text-gray-900 font-medium">
            {product.name}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image */}
            <div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={90} className="text-gray-300" />
                )}

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:scale-105 transition"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={21}
                    className={
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
              <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                {product.category || "General"}
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-gray-400">
                  <Star size={17} className="inline mr-1" />
                  Reviews coming soon
                </span>

                <span className="text-gray-300">|</span>

                {inStock ? (
                  <span className="text-sm text-green-600 font-medium">
                    <CheckCircle size={15} className="inline mr-1" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-7 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {formatPKR(Number(product.price))}
                </span>
              </div>

              <p className="text-gray-600 leading-7 mt-6">
                {product.description || "No product description available."}
              </p>

              {/* Seller Information */}
              <div className="border border-gray-100 rounded-xl p-4 mt-7 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <Store size={22} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Sold by</p>
                    <p className="font-semibold text-gray-900">
                      {seller.shop_name}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/store/${storeSlug}`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Visit Store
                </Link>
              </div>

              {/* Quantity */}
              <div className="mt-7">
                <p className="font-semibold text-gray-900 mb-3">
                  Quantity
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.max(1, q - 1))
                      }
                      disabled={!inStock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={17} />
                    </button>

                    <span className="px-5 font-semibold">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(product.stock, q + 1)
                        )
                      }
                      disabled={!inStock || quantity >= product.stock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  <span className="text-sm text-gray-500">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Cart Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                <button
                  onClick={addToCart}
                  disabled={!inStock}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition"
                >
                  Buy Now
                </button>
              </div>

              {cartMessage && (
                <p
                  className="mt-3 text-sm text-blue-600 font-medium"
                  role="status"
                >
                  {cartMessage}
                </p>
              )}

              {/* Shopping Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Truck className="text-blue-600" size={21} />
                  <span className="text-xs text-gray-600">
                    Fast Delivery
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={21} />
                  <span className="text-xs text-gray-600">
                    Secure Shopping
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <RotateCcw className="text-blue-600" size={21} />
                  <span className="text-xs text-gray-600">
                    Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Reviews */}
          <div className="mt-14 border-t border-gray-100 pt-7">
            <div className="flex gap-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 font-semibold text-sm ${
                  activeTab === "description"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Description
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 font-semibold text-sm ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Reviews
              </button>
            </div>

            <div className="py-6 text-gray-600 leading-7">
              {activeTab === "description" ? (
                <p>
                  {product.description || "No product description available."}
                </p>
              ) : (
                <p>
                  Customer reviews will appear here once the review system is connected.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}