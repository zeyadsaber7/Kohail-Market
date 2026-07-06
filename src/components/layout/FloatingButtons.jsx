import { MessageCircle, Facebook } from "lucide-react";
import { CONTACT } from "../../constants/site";

/**
 * FloatingButtons
 * Persistent WhatsApp + Facebook buttons, fixed to the corner of the
 * viewport on every page (mounted once in App.jsx layout).
 */
export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${CONTACT.whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle size={26} fill="white" />
      </a>
      <a
        href={CONTACT.facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-[#1877F2] shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
        aria-label="صفحتنا على فيسبوك"
      >
        <Facebook size={24} fill="white" />
      </a>
    </div>
  );
}
