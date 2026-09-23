import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { SiteCredit } from '@/components/SiteCredit';
import { WeddingSiteProvider } from '@/components/WeddingSiteProvider';
import { AdminApp } from '@/admin/AdminApp';
import { GiftsPage } from '@/pages/GiftsPage';
import { AlbumSection } from '@/sections/AlbumSection';
import { ClosingSection } from '@/sections/ClosingSection';
import { DressCodeSection } from '@/sections/DressCodeSection';
import { GiftsSection } from '@/sections/GiftsSection';
import { HeroSection } from '@/sections/HeroSection';
import { RsvpSection } from '@/sections/RsvpSection';
import { WeddingSection } from '@/sections/WeddingSection';
import { useWeddingSite } from '@/hooks/use-wedding-site';

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

function PublicTitle() {
  const site = useWeddingSite();
  useEffect(() => {
    document.title = site.siteTitle;
  }, [site.siteTitle]);
  return null;
}

function PublicApp({ path }: { path: string }) {
  return (
    <WeddingSiteProvider>
      <PublicTitle />
      {path === '/presentes' ? <GiftsPage /> : <InvitePage />}
    </WeddingSiteProvider>
  );
}

export function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/admin' || path.startsWith('/admin/')) return <AdminApp />;
  return <PublicApp path={path} />;
}
