import { Header } from '@/components/Header';
import { GiftsPage } from '@/pages/GiftsPage';
import { AlbumSection } from '@/sections/AlbumSection';
import { ClosingSection } from '@/sections/ClosingSection';
import { DressCodeSection } from '@/sections/DressCodeSection';
import { GiftsSection } from '@/sections/GiftsSection';
import { HeroSection } from '@/sections/HeroSection';
import { RsvpSection } from '@/sections/RsvpSection';
import { WeddingSection } from '@/sections/WeddingSection';

function InvitePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WeddingSection />
        <DressCodeSection />
        <GiftsSection />
        <RsvpSection />
        <AlbumSection />
        <ClosingSection />
      </main>
      <footer className="site-credit">
        <p>
          © 2026 Enlace por{' '}
          <a href="https://kybers.com.br/" target="_blank" rel="noreferrer">
            Kyber Soluçoes
          </a>
          . Todos os direitos reservados.
        </p>
      </footer>
    </>
  );
}

export function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/presentes') return <GiftsPage />;
  return <InvitePage />;
}
