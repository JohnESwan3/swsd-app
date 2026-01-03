import "./App.css";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar"
import {ThemeProvider} from "@/components/theme-provider.tsx";
import { useState, useEffect } from "react";

function App({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-state')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('sidebar-state', JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <AppSidebar />
        <main>
          <SidebarTrigger/>
          {children}
        </main>
      </SidebarProvider>
      </ThemeProvider>
  );
}

export default App;
