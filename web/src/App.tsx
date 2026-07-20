import { HashRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Category } from "./pages/Category";
import { MapPage } from "./pages/MapPage";
import { SearchResults } from "./pages/SearchResults";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
        <footer className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
          Guía CDMX · Ciudad de México
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
