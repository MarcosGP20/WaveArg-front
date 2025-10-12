"use client";
import React from "react";

const CommunitySection = () => (
  <section className="py-20 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[600px] flex items-center">
        <img
          src="/wave-comunidad.jpg"
          alt="Comunidad móvil"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl px-8 md:px-12 lg:px-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Únete a nuestra comunidad
          </h2>
          <p className="text-gray-200 text-lg mb-10 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#05467D] hover:bg-gray-500 text-white px-8 py-3 rounded-full transition-colors">
              ¡Quiero unirme!
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CommunitySection;
