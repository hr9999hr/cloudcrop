import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useGameSync } from "@/hooks/useGameSync";
import { useGameStore } from "@/store/gameStore";
import { Banknote } from "lucide-react";
import logo from "@/assets/logo.png";
import ccCoin from "@/assets/cc-coin.png";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { coins, realMoney, waterDrops, weather } = useGameStore();

  const weatherEmojis: Record<string, string> = {
    sunny: '☀️',
    rainy: '🌧️',
    heatwave: '🔥',
    monsoon: '🌊',
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <img src={logo} alt="CloudCrop" className="h-7 w-7 rounded-lg" />
              <span className="text-lg font-bold text-foreground hidden sm:block">CloudCrop</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span>{weatherEmojis[weather]}</span>
                <span className="hidden sm:inline capitalize text-muted-foreground">{weather}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-water">
                <span>💧</span>
                <span>{waterDrops}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-money">
                <Banknote className="w-4 h-4" />
                <span>RM {realMoney.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-coin">
                <img src={ccCoin} alt="CC" className="w-5 h-5" />
                <span>{coins}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
