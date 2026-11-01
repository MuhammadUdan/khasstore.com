
"use client";

import { useEffect, useRef, useState } from "react";

import {
  X,
  Send,
  Bot,
  Trash2,
} from "lucide-react";

type Language = "urdu" | "roman" | "english";

type ChatMessage = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

const STORAGE_KEY = "khasstore-ai-chat";

const WELCOME_MESSAGE =
  "As-salamu Alaikum! Me KhasStore ka AI helper hun, bataiye me aapki kya madad kar sakta hun?";

function detectLanguage(text: string): Language {
  if (/[\u0600-\u06FF]/.test(text)) {
    return "urdu";
  }

  const romanUrduWords =
    /\b(kaise|kaisay|kya|kia|hai|hain|karna|karun|karein|karen|mujhe|mera|meri|apka|aapka|aap|kahan|kyun|chahiye|batao|bataiye|kaise|krna|krun|nahi|nahin|aur|mein|me|se|ko|ka|ki|ke|liye|shop)\b/i;

  if (romanUrduWords.test(text)) {
    return "roman";
  }

  return "english";
}

function getAnswer(question: string, language: Language): string {
  const q = question.toLowerCase();

  const topics = {
    shop:
      /shop|store|seller|dukan|dukaan|شاپ|دکان|اسٹور|بناؤں|banao|banau|banana/,
    product:
      /product|item|پروڈکٹ|مصنوعات|add product|product add|shamil|include|upload/,
    payment:
      /payment|subscription|easypaisa|raast|ایزی پیسہ|رقم|ادائیگی|فیس|tid/,
    order:
      /order|orders|manage|manage order|آرڈر|آرڈرز|انتظام/,
    about:
      /khasstore|what is|about|marketplace|کیا ہے|خاس اسٹور|کیسے کام/,
  };

  if (topics.shop.test(q)) {
    if (language === "urdu") {
      return "اپنی دکان بنانے کے لیے یہ مراحل مکمل کریں:\n\n1. Seller Registration صفحہ کھولیں۔\n2. اپنا نام، موبائل نمبر اور ضروری معلومات درج کریں۔\n3. اپنی درخواست جمع کروائیں۔\n4. ایڈمن کی منظوری کے بعد اپنے Seller Dashboard میں لاگ اِن کریں۔\n5. اپنی دکان کی معلومات مکمل کریں۔";
    }

    if (language === "roman") {
      return "Apni shop banane ke liye ye steps follow karein:\n\n1. Seller Registration page open karein.\n2. Apna naam aur mobile number enter karein.\n3. Registration form submit karein.\n4. Admin approval ka intezar karein.\n5. Approval ke baad Seller Dashboard mein login karein aur apni shop setup karein.";
    }

    return "Follow these steps to create your shop:\n\n1. Open the Seller Registration page.\n2. Enter your name and mobile number.\n3. Submit your registration form.\n4. Wait for admin approval.\n5. After approval, log in to your Seller Dashboard and complete your shop setup.";
  }

  if (topics.product.test(q)) {
    if (language === "urdu") {
      return "پروڈکٹ شامل کرنے کے لیے:\n\n1. اپنے Seller Dashboard میں لاگ اِن کریں۔\n2. Products صفحہ کھولیں۔\n3. Add Product پر کلک کریں۔\n4. پروڈکٹ کا نام، قیمت، تفصیل اور تصویر شامل کریں۔\n5. Save پر کلک کریں۔";
    }

    if (language === "roman") {
      return "Product add karne ke liye:\n\n1. Seller Dashboard mein login karein.\n2. Products page open karein.\n3. Add Product par click karein.\n4. Product ka naam, price, description aur image add karein.\n5. Save button par click karein.";
    }

    return "To add a product:\n\n1. Log in to your Seller Dashboard.\n2. Open the Products page.\n3. Click Add Product.\n4. Enter the product name, price, description and image.\n5. Click Save.";
  }

  if (topics.payment.test(q)) {
    if (language === "urdu") {
      return "سبسکرپشن کی ادائیگی کے لیے:\n\n1. اپنا منتخب کردہ پلان دیکھیں۔\n2. ادائیگی کے لیے Easypaisa یا Raast ID کی تفصیلات حاصل کریں۔\n3. مطلوبہ رقم ادا کریں۔\n4. اپنے Transaction ID اور آخری 4 ہندسے فراہم کریں۔\n5. ایڈمن کی تصدیق کے بعد آپ کی سبسکرپشن فعال ہوگی۔\n\nنوٹ: ادائیگی کا اصل طریقہ اور تفصیلات ویب سائٹ پر دستیاب ہونے پر دیکھیں۔";
    }

    if (language === "roman") {
      return "Subscription payment ka tareeqa:\n\n1. Apna selected plan check karein.\n2. Easypaisa ya Raast ID ki payment details hasil karein.\n3. Required amount pay karein.\n4. Transaction ID aur last 4 digits provide karein.\n5. Admin verification ke baad subscription activate hogi.\n\nNote: Payment feature abhi website par implement hona baqi hai.";
    }

    return "Subscription payment steps:\n\n1. Check your selected plan.\n2. Get the official Easypaisa or Raast payment details.\n3. Pay the required amount.\n4. Provide your transaction ID and last 4 digits.\n5. Your subscription will be activated after admin verification.\n\nNote: The payment feature has not been implemented on the website yet.";
  }

  if (topics.order.test(q)) {
    if (language === "urdu") {
      return "آرڈرز مینیج کرنے کے لیے:\n\n1. Seller Dashboard میں لاگ اِن کریں۔\n2. Orders صفحہ کھولیں۔\n3. نئے آرڈرز دیکھیں۔\n4. آرڈر کی تفصیلات چیک کریں۔\n5. دستیاب آپشنز کے ذریعے آرڈر کا اسٹیٹس اپ ڈیٹ کریں۔";
    }

    if (language === "roman") {
      return "Orders manage karne ke liye:\n\n1. Seller Dashboard mein login karein.\n2. Orders page open karein.\n3. New orders check karein.\n4. Order ki details dekhein.\n5. Available options se order ka status update karein.";
    }

    return "To manage your orders:\n\n1. Log in to your Seller Dashboard.\n2. Open the Orders page.\n3. Check new orders.\n4. Review the order details.\n5. Update the order status using the available options.";
  }

  if (topics.about.test(q)) {
    if (language === "urdu") {
      return "KhasStore ایک آن لائن مارکیٹ پلیس ہے جہاں سیلرز اپنی مصنوعات فروخت کر سکتے ہیں اور خریدار مختلف مصنوعات خرید سکتے ہیں۔\n\nہمارا مقصد خریداروں اور فروخت کنندگان کے درمیان اعتماد قائم کرنا ہے۔ ابتدائی خریداریوں کے لیے Cash on Delivery کا نظام رکھا گیا ہے۔";
    }

    if (language === "roman") {
      return "KhasStore aik online marketplace hai jahan sellers apni products sell kar sakte hain aur customers shopping kar sakte hain.\n\nHamara maqsad buyers aur sellers ke darmiyan trust banana hai. Initial shopping ke liye Cash on Delivery ka system rakha gaya hai.";
    }

    return "KhasStore is an online marketplace where sellers can sell their products and customers can shop online.\n\nOur goal is to build trust between buyers and sellers. Cash on Delivery is the initial shopping payment method.";
  }

  if (language === "urdu") {
    return "معذرت، مجھے آپ کا سوال سمجھ نہیں آیا۔ براہِ کرم دکان بنانے، پروڈکٹ شامل کرنے، ادائیگی یا آرڈر کے بارے میں سوال کریں۔";
  }

  if (language === "roman") {
    return "Maazrat, mujhe aapka sawal samajh nahi aaya. Aap shop banane, product add karne, payment ya orders ke bare mein pooch sakte hain.";
  }

  return "Sorry, I could not understand your question. Please ask about creating a shop, adding products, subscription payments or managing orders.";
}

export default function AiHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      setMessages([]);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function sendMessage() {
    const question = input.trim();

    if (!question || isTyping) return;

    const language = detectLanguage(question);

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: question,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const answer = getAnswer(question, language);

    window.setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: answer,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 700);
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open KhasStore AI Helper"
          className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-[#0D6EFD] text-xl font-extrabold text-white shadow-xl shadow-blue-500/30 transition hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-pulse"
        >
          AI
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end bg-black/30 sm:items-end sm:bg-transparent sm:p-5">
          <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[600px] sm:max-h-[85vh] sm:w-[380px] sm:rounded-2xl sm:border sm:border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#0D6EFD] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                  <Bot size={25} />
                </div>

                <div>
                  <h3 className="font-bold">
                    KhasStore AI Helper
                  </h3>
                  <p className="text-xs text-blue-100">
                    Online Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  aria-label="Clear chat"
                  className="rounded-full p-2 transition hover:bg-white/20"
                >
                  <Trash2 size={18} />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-full p-2 transition hover:bg-white/20"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-gray-700 shadow-sm">
                    {WELCOME_MESSAGE}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    dir="auto"
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.sender === "user"
                        ? "rounded-br-sm bg-[#0D6EFD] text-white"
                        : "rounded-tl-sm bg-white text-gray-700 shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-5 py-4 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Yahan sawal likhein... / Type your question..."
                  className="min-w-0 flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0D6EFD] focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0D6EFD] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>

              <p className="mt-2 text-center text-[10px] text-gray-400">
                KhasStore AI Helper
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
