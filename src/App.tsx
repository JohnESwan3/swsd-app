import "./App.css";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar"
import {ThemeProvider} from "@/components/theme-provider.tsx";

function App({ children }: { children: React.ReactNode }) {

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <SidebarProvider>
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
