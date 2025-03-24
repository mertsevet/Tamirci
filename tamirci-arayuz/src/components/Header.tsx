'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-transparent">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={140}
                height={42}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              href="/giris"
              className="rounded-lg px-8 py-2.5 text-base font-normal text-white bg-transparent border-2 border-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              Giriş
            </Link>
            <Link
              href="/hizmet-ver"
              className="rounded-lg px-8 py-2.5 text-base font-normal text-white bg-transparent border-2 border-gray-300 hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              Hizmet ver
            </Link>
            <Link
              href="/ilanlar"
              className="rounded-lg px-8 py-2.5 text-base font-normal text-red-500 bg-transparent border-2 border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              İlanlar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-gray-200 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Menüyü aç</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/giris"
                className="block px-3 py-2 text-base font-semibold text-white hover:text-gray-200 transition-colors duration-200"
              >
                Giriş
              </Link>
              <Link
                href="/hizmet-ver"
                className="block px-3 py-2 text-base font-semibold text-white hover:text-gray-200 transition-colors duration-200"
              >
                Hizmet ver
              </Link>
              <Link
                href="/ilanlar"
                className="block px-3 py-2 text-base font-semibold text-white hover:text-gray-200 transition-colors duration-200"
              >
                İlanlar
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 