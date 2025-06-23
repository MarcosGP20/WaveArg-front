"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-[85vh] bg-gradient-to-r from-white to-[#f0f4f8] flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bienvenido a <span className="text-[#0077b6]">WaveArg</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            La mejor selección de iPhones al mejor precio. Tecnología, diseño y
            confianza en un solo lugar.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Ver productos <ArrowRight size={20} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <Image
            src="/mock/iphone_14_pro.jpg"
            alt="iPhone"
            width={400}
            height={400}
            className="rounded-xl"
            priority
          />
        </motion.div>
      </div>
    </main>
  );
}
