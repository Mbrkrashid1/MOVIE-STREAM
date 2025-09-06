import { SidebarProvider } from "@/components/ui/sidebar";
import { YouTubeSidebar } from "./YouTubeSidebar";
import YouTubeNavbar from "./YouTubeNavbar";

interface YouTubeLayoutProps {
  children: React.ReactNode;
}

const YouTubeLayout = ({ children }: YouTubeLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-white">
        <YouTubeNavbar />
        <YouTubeSidebar />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default YouTubeLayout;