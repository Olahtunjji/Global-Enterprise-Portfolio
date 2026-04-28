import { ReactNode } from "react";
import SkillsBanner from "./SkillsBanner";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <SkillsBanner />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
