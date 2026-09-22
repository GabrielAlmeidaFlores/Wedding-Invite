import { Header } from '@/components/Header';
import { AlbumSection } from '@/sections/AlbumSection';
import { ClosingSection } from '@/sections/ClosingSection';
import { DressCodeSection } from '@/sections/DressCodeSection';
import { GiftsSection } from '@/sections/GiftsSection';
import { HeroSection } from '@/sections/HeroSection';
import { RsvpSection } from '@/sections/RsvpSection';
import { WeddingSection } from '@/sections/WeddingSection';

export function App() {
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
    </>
  );
}
