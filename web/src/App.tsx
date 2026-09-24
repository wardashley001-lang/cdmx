import { HashRouter, Routes, Route } from "react-router-dom";
import { Header, Footer, MobileTabBar } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { Mapa } from "./pages/Mapa";
import { MiLista } from "./pages/MiLista";
import { ToastProvider } from "./lib/ToastProvider";
import { SavedProvider } from "./lib/useSaved";

function App() {
  return (
    <SavedProvider>
      <ToastProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/mi-lista" element={<MiLista />} />
              </Routes>
            </main>
            <Routes>
              <Route path="/" element={<Footer />} />
              <Route path="/mi-lista" element={<Footer />} />
            </Routes>
            <MobileTabBar />
          </div>
        </HashRouter>
      </ToastProvider>
    </SavedProvider>
  );
}

export default App;
