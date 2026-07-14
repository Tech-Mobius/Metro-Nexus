import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import SoftAurora from './ui/SoftAurora';

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      {!isHome && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30" aria-hidden="true">
          <SoftAurora
            speed={0.4}
            scale={1.4}
            brightness={0.7}
            color1="#007BFF"
            color2="#FF2D7A"
            enableMouseInteraction={true}
            mouseInfluence={0.15}
          />
        </div>
      )}
      <Navbar />
      <main className={`relative z-10 flex-1 ${isHome ? '' : 'px-6 pb-20 pt-28 sm:px-10'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
