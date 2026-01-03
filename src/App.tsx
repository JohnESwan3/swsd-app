import "./App.css";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar"

function App({ children }: { children: React.ReactNode }) {

  return (
      <SidebarProvider>
          <AppSidebar />
        <main>
          <SidebarTrigger/>
          {children}
        </main>
      </SidebarProvider>
  );
}

export default App;
