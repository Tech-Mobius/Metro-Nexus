import { Outlet, useLocation } from 'react-router-dom';
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
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
