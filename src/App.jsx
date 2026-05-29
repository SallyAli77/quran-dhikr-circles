import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Quran from './pages/Quran';
import PrayerTimes from './pages/PrayerTimes';
import Articles from './pages/Articles';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Legal from './pages/Legal';
import Products from './pages/Products';

function AppContent() {
  const [activePage, setActivePage] = useState("home");
  const { language } = useApp();

  // Simple clean client-side page router
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'quran':
        return <Quran setActivePage={setActivePage} />;
      case 'prayer':
        return <PrayerTimes />;
      case 'articles':
        return <Articles />;
      case 'community':
        return <Community />;
      case 'products':
        return <Products />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'privacy':
        return <Legal initialTab="privacy" setActivePage={setActivePage} />;
      case 'terms':
        return <Legal initialTab="terms" setActivePage={setActivePage} />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-layout" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Premium Transparent Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Core Platform Content */}
      <main className="main-content">
        {renderActivePage()}
      </main>

      {/* Dynamic footer quotes */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
