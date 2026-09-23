import { Header } from '@/components/Header';
import { SiteCredit } from '@/components/SiteCredit';
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
      <SiteCredit />
    </>
  );
}

export function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/presentes') return <GiftsPage />;
  return <InvitePage />;
}
