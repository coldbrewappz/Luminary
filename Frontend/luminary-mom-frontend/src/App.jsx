import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import QuotesPage from './pages/QuotesPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-linen min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<QuotesPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App