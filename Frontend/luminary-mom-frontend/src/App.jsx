import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import QuotesPage from './pages/QuotesPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function MainApp() {
  const location = useLocation()

  return (
    <div className="bg-linen min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* key={location.key} forces a remount so clicking "Quotes" while
              already on this page resets the category/filter state */}
          <Route path="/quotes" element={<QuotesPage key={location.key} />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth pages — no header/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main app — with header and footer */}
        <Route path="/*" element={<MainApp />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App