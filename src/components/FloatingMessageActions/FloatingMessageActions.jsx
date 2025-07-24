import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

export default function FloatingIconMenu() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent.toLowerCase();
      return /android|iphone|ipad|ipod/i.test(ua);
    };
    setIsMobile(checkMobile());
  }, []);

  const whatsappLink = isMobile ? `https://wa.me/?text=Hii` : `https://wa.me/`;

  const emailLink = isMobile
    ? `mailto:`
    : `https://mail.google.com/mail/?view=cm&`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <motion.div
        initial={false}
        className="flex flex-col items-center mb-3 space-y-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto"
      >
        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-200 hover:bg-green-300 text-black rounded-full flex items-center justify-center shadow-md"
          aria-label="WhatsApp"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="whatsapp"
            className="w-5 h-5"
          />
        </a>

        {/* Email */}
        <a
          href={emailLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"
          aria-label="Email"
        >
          <Mail size={20} />
        </a>
      </motion.div>

      <div className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-xl flex items-center justify-center transition duration-300">
        <MessageCircle size={24} />
      </div>
    </div>
  );
}
