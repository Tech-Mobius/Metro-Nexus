import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import Layout from './components/Layout';
import Home from './pages/Home';
import Network from './pages/Network';
import Stations from './pages/Stations';
import StationDetail from './pages/StationDetail';
import Create from './pages/Create';
import Gallery from './pages/Gallery';
import Journey from './pages/Journey';
import Journeys from './pages/Journeys';
import Nexus from './pages/Nexus';
import Impact from './pages/Impact';
import Design from './pages/Design';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tickets from './pages/Tickets';
import { AuthProvider } from './context/AuthContext';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="network" element={<Network />} />
          <Route path="stations" element={<Stations />} />
          <Route path="stations/:slug" element={<StationDetail />} />
          <Route path="create" element={<Create />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="journey" element={<Journey />} />
          <Route path="journeys" element={<Journeys />} />
          <Route path="nexus" element={<Nexus />} />
          <Route path="impact" element={<Impact />} />
          <Route path="design" element={<Design />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
