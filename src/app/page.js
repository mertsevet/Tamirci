'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      name: 'Beyaz Eşya',
      icon: '/icons/appliance.png',
      description: 'Buzdolabı, çamaşır makinesi, bulaşık makinesi ve diğer beyaz eşyalarınız için profesyonel tamir hizmeti.'
    },
    {
      name: 'Küçük Ev Aletleri',
      icon: '/icons/small-appliance.png',
      description: 'Ütü, tost makinesi, blender ve diğer küçük ev aletleriniz için hızlı ve güvenilir tamir.'
    },
    {
      name: 'Bilgisayar',
      icon: '/icons/computer.png',
      description: 'Masaüstü ve dizüstü bilgisayarlarınız için donanım ve yazılım tamir hizmeti.'
    },
    {
      name: 'Telefon',
      icon: '/icons/phone.png',
      description: 'Akıllı telefon ve tabletleriniz için ekran, batarya ve diğer tamir hizmetleri.'
    }
  ];

  const features = [
    {
      name: 'Güvenilir Tamirciler',
      description: 'Tüm tamircilerimiz özenle değerlendirilir ve seçilir.',
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      name: 'Garantili Hizmet',
      description: 'Yapılan tüm tamir işlemleri garanti kapsamındadır.',
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: '7/24 Destek',
      description: 'Teknik destek ekibimiz her zaman yanınızda.',
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background.jpg"
            alt="Tamir Atölyesi"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10">
          <Header />
          
          {/* Hero Section with Search */}
          <div className="min-h-[600px] flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  <span className="block">Profesyonel</span>
                  <span className="block text-red-500">Tamir Hizmeti</span>
                </h1>
                <p className="mx-auto mt-3 max-w-md text-base text-gray-100 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                  Aradığınız tamirci bir tık uzağınızda. Güvenilir ve profesyonel hizmet için hemen başlayın.
                </p>
                
                {/* Search Bar */}
                <div className="mt-8 flex justify-center">
                  <div className="w-full max-w-2xl">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ne tamir ettirmek istiyorsunuz?"
                        className="w-full px-6 py-3 text-base rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                      <button className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 text-base font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Ara
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={32}
                    height={32}
                    className="text-gray-700"
                  />
                </div>
                <span className="text-base font-medium text-gray-900 text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Neden Biz?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Profesyonel ve güvenilir tamir hizmeti için doğru adres.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-xl mb-4">
                  <feature.icon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 