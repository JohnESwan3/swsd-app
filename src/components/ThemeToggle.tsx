import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const { open } = useSidebar()

    const themes = [
        { name: "Light", value: "light" as const, icon: Sun },
        { name: "Dark", value: "dark" as const, icon: Moon },
        { name: "System", value: "system" as const, icon: Monitor },
    ]

    const currentTheme = themes.find(t => t.value === theme) || themes[0]

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.value === theme)
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex].value)
    }

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={cycleTheme}
                            tooltip={currentTheme.name}
                        >
                            <currentTheme.icon />
                            {open && <span>{currentTheme.name}</span>}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
