import { HashRouter, Routes, Route } from "react-router-dom";
import { Header, Footer, MobileTabBar } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { lazy, Suspense } from "react";
import { MiLista } from "./pages/MiLista";
import { Starter } from "./pages/Starter";
import { StarterThanks } from "./pages/StarterThanks";
const Mapa = lazy(() => import("./pages/Mapa").then((m) => ({ default: m.Mapa })));
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
                <Route path="/mapa" element={<Suspense fallback={null}><Mapa /></Suspense>} />
                <Route path="/mi-lista" element={<MiLista />} />
                <Route path="/starter" element={<Starter />} />
                <Route path="/your-starter" element={<StarterThanks />} />
              </Routes>
            </main>
            <Routes>
              <Route path="/" element={<Footer />} />
              <Route path="/mi-lista" element={<Footer />} />
              <Route path="/starter" element={<Footer />} />
              <Route path="/your-starter" element={<Footer />} />
            </Routes>
            <MobileTabBar />
          </div>
        </HashRouter>
      </ToastProvider>
    </SavedProvider>
  );
}

export default App;
