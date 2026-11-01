
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";

const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    category: "Headphones",
    price: 4500,
    oldPrice: 6000,
    rating: 4.8,
    reviews: 124,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
    description:
      "Enjoy premium sound quality with these wireless Bluetooth headphones. Designed for comfort, clear audio and long-lasting battery performance.",
    seller: "Ali Electronics",
  },
  {
    id: "2",
    name: "Smart Watch Series 8",
    category: "Watches",
    price: 6500,
    oldPrice: 8000,
    rating: 4.6,
    reviews: 86,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
    description:
      "A stylish smartwatch with a modern design. Perfect for everyday use, fitness tracking and staying connected.",
    seller: "Ali Electronics",
  },
  {
    id: "3",
    name: "Premium Sports Shoes",
    category: "Shoes",
    price: 3800,
    oldPrice: 5000,
    rating: 4.7,
    reviews: 56,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    description:
      "Comfortable and stylish sports shoes suitable for walking, running and daily activities.",
    seller: "Ali Store",
  },
  {
    id: "4",
    name: "Everyday Travel Backpack",
    category: "Fashion",
    price: 3499,
    oldPrice: 4500,
    rating: 4.5,
    reviews: 42,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
    description:
      "A practical everyday backpack with a spacious design. Ideal for travel, work, university and daily use.",
    seller: "Ali Store",
  },
];

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const product = products.find((item) => item.id === id);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [cartMessage, setCartMessage] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="text-gray-500 mt-2">
            Sorry, this product is not available.
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const addToCart = () => {
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
                quantity: Math.min(
                  item.quantity + quantity,
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
            price: product.price,
            image: product.image,
            quantity,
          },
        ];
      }

      localStorage.setItem(
        "khasstore-cart",
        JSON.stringify(updatedCart)
      );

      setCartMessage(`${quantity} item(s) added to cart successfully!`);
    } catch {
      setCartMessage("Unable to save cart. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight size={15} />
          <Link href="/products" className="hover:text-blue-600">
            Products
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
            <div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                  {discount}% OFF
                </span>

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

            <div className="flex flex-col">
              <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                {product.category}
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={17} fill="currentColor" />
                  <span className="font-semibold text-gray-900">
                    {product.rating}
                  </span>
                </div>

                <span className="text-sm text-gray-500">
                  ({product.reviews} Reviews)
                </span>

                <span className="text-gray-300">|</span>

                <span className="text-sm text-green-600 font-medium">
                  <CheckCircle size={15} className="inline mr-1" />
                  In Stock
                </span>
              </div>

              <div className="flex items-center gap-3 mt-7 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {product.price.toLocaleString("en-PK")}
                </span>

                <span className="text-lg text-gray-400 line-through">
                  Rs. {product.oldPrice.toLocaleString("en-PK")}
                </span>
              </div>

              <p className="text-sm text-green-600 font-medium mt-2">
                You save Rs.{" "}
                {(product.oldPrice - product.price).toLocaleString("en-PK")}
              </p>

              <p className="text-gray-600 leading-7 mt-6">
                {product.description}
              </p>

              <div className="border border-gray-100 rounded-xl p-4 mt-7 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <Store size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sold by</p>
                    <p className="font-semibold text-gray-900">
                      {product.seller}
                    </p>
                  </div>
                </div>

                <Link
                  href="/store/ali-electronics"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Visit Store
                </Link>
              </div>

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
                      className="p-3 hover:bg-gray-100"
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
                      disabled={quantity >= product.stock}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                <button
                  onClick={addToCart}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    setCartMessage("Checkout integration coming soon!")
                  }
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition"
                >
                  Buy Now
                </button>
              </div>

              {cartMessage && (
                <p className="mt-3 text-sm text-blue-600 font-medium" role="status">
                  {cartMessage}
                </p>
              )}

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
                Reviews ({product.reviews})
              </button>
            </div>

            <div className="py-6 text-gray-600 leading-7">
              {activeTab === "description" ? (
                <p>{product.description}</p>
              ) : (
                <p>
                  Customer reviews will appear here once the review
                  system is connected.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
