//*
// - Notification Settings
// - "View" URLs
// - SLA Timers
// - Accent Colors
// - Upload Word Template to build new documentation? (Potentially future functionality)
// */

//
// A bunch of placeholder options. The only thing that works now is the
// accent color switch. Animations for border hover effect still needs
// work too!
// These cards should be made into a component (like the rest of the
// placeholder cards and data) but I just need a layout for now.
// */
import { useState, useEffect } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, Plus, Trash2 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ViewUrl {
    id: number
    name: string
    url: string
}

const accentColors = {
    stone: { light: "87 83 78", dark: "87 83 78", gradient: { from: "87 83 78", to: "68 64 60" } },
    slate: { light: "71 85 105", dark: "71 85 105", gradient: { from: "71 85 105", to: "51 65 85" } },
    red: { light: "220 38 38", dark: "185 28 28", gradient: { from: "220 38 38", to: "185 28 28" } },
    orange: { light: "234 88 12", dark: "194 65 12", gradient: { from: "234 88 12", to: "217 119 6" } },
    amber: { light: "217 119 6", dark: "180 83 9", gradient: { from: "217 119 6", to: "180 83 9" } },
    yellow: { light: "202 138 4", dark: "161 98 7", gradient: { from: "202 138 4", to: "180 83 9" } },
    lime: { light: "101 163 13", dark: "77 124 15", gradient: { from: "101 163 13", to: "22 163 74" } },
    green: { light: "22 163 74", dark: "21 128 61", gradient: { from: "22 163 74", to: "5 150 105" } },
    emerald: { light: "5 150 105", dark: "4 120 87", gradient: { from: "5 150 105", to: "13 148 136" } },
    teal: { light: "13 148 136", dark: "15 118 110", gradient: { from: "13 148 136", to: "8 145 178" } },
    cyan: { light: "8 145 178", dark: "14 116 144", gradient: { from: "8 145 178", to: "3 105 161" } },
    sky: { light: "3 105 161", dark: "7 89 133", gradient: { from: "3 105 161", to: "29 78 216" } },
    blue: { light: "37 99 235", dark: "29 78 216", gradient: { from: "37 99 235", to: "30 64 175" } },
    indigo: { light: "79 70 229", dark: "67 56 202", gradient: { from: "79 70 229", to: "55 48 163" } },
    violet: { light: "124 58 237", dark: "109 40 217", gradient: { from: "124 58 237", to: "91 33 182" } },
    purple: { light: "147 51 234", dark: "126 34 206", gradient: { from: "147 51 234", to: "107 33 168" } },
    fuchsia: { light: "192 38 211", dark: "162 28 176", gradient: { from: "192 38 211", to: "134 25 143" } },
    pink: { light: "219 39 119", dark: "190 24 93", gradient: { from: "219 39 119", to: "157 23 77" } },
    rose: { light: "225 29 72", dark: "190 18 60", gradient: { from: "225 29 72", to: "159 18 57" } },
}

export default function Settings() {
    const [solarWindsUrl, setSolarWindsUrl] = useState(() => {
        return localStorage.getItem("solarwinds-url") || ""
    })
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem("accent-color") || "blue"
    })
    const [viewUrls, setViewUrls] = useState<ViewUrl[]>(() => {
        const saved = localStorage.getItem("view-urls")
        return saved ? JSON.parse(saved) : [
            { id: 1, name: "New", url: "" },
            { id: 2, name: "Pending Assignment", url: "" },
            { id: 3, name: "Waiting", url: "" },
        ]
    })
    const [refreshRate, setRefreshRate] = useState(() => {
        return localStorage.getItem("refresh-rate") || "5min"
    })
    const [slaBreachTimes, setSlaBreachTimes] = useState<string[]>(() => {
        const saved = localStorage.getItem("sla-breach-times")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // Ensure it's an array (convert old object format to array)
                if (Array.isArray(parsed)) {
                    return parsed
                }
            } catch (e) {
                // Invalid JSON, return default
            }
        }
        return []
    })
    const [notifyTagged, setNotifyTagged] = useState(() => {
        return localStorage.getItem("notify-tagged") === "true"
    })
    const [notifySyncFails, setNotifySyncFails] = useState(() => {
        return localStorage.getItem("notify-sync-fails") === "true"
    })
    const [notifySyncRefresh, setNotifySyncRefresh] = useState(() => {
        return localStorage.getItem("notify-sync-refresh") === "true"
    })
    const [viewNotifications, setViewNotifications] = useState(() => {
        const saved = localStorage.getItem("view-notifications")
        return saved ? JSON.parse(saved) : {
            "New": false,
            "Pending Assignment": false,
            "Waiting": false,
        }
    })

    useEffect(() => {
        localStorage.setItem("solarwinds-url", solarWindsUrl)
    }, [solarWindsUrl])

    useEffect(() => {
        localStorage.setItem("view-urls", JSON.stringify(viewUrls))
    }, [viewUrls])

    useEffect(() => {
        localStorage.setItem("refresh-rate", refreshRate)
    }, [refreshRate])

    useEffect(() => {
        localStorage.setItem("sla-breach-times", JSON.stringify(slaBreachTimes))
    }, [slaBreachTimes])

    useEffect(() => {
        localStorage.setItem("notify-tagged", notifyTagged.toString())
    }, [notifyTagged])

    useEffect(() => {
        localStorage.setItem("notify-sync-fails", notifySyncFails.toString())
    }, [notifySyncFails])

    useEffect(() => {
        localStorage.setItem("notify-sync-refresh", notifySyncRefresh.toString())
    }, [notifySyncRefresh])

    useEffect(() => {
        localStorage.setItem("view-notifications", JSON.stringify(viewNotifications))
    }, [viewNotifications])

    useEffect(() => {
        localStorage.setItem("accent-color", accentColor)
        const root = document.documentElement
        const isDark = root.classList.contains("dark")
        const colorValue = accentColors[accentColor as keyof typeof accentColors]

        if (colorValue) {
            root.style.setProperty("--accent", isDark ? colorValue.dark : colorValue.light)
            root.style.setProperty("--accent-from", colorValue.gradient.from)
            root.style.setProperty("--accent-to", colorValue.gradient.to)
        }
    }, [accentColor])

    // Apply accent color on mount and theme changes
    useEffect(() => {
        const applyAccent = () => {
            const root = document.documentElement
            const isDark = root.classList.contains("dark")
            const colorValue = accentColors[accentColor as keyof typeof accentColors]

            if (colorValue) {
                root.style.setProperty("--accent", isDark ? colorValue.dark : colorValue.light)
                root.style.setProperty("--accent-from", colorValue.gradient.from)
                root.style.setProperty("--accent-to", colorValue.gradient.to)
            }
        }

        applyAccent()

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    applyAccent()
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })
        return () => observer.disconnect()
    }, [accentColor])

    const addViewUrl = () => {
        const newId = Math.max(...viewUrls.map(v => v.id), 0) + 1
        setViewUrls([...viewUrls, { id: newId, name: "", url: "" }])
    }

    const removeViewUrl = (id: number) => {
        setViewUrls(viewUrls.filter(v => v.id !== id))
    }

    const updateViewUrl = (id: number, field: "name" | "url", value: string) => {
        setViewUrls(viewUrls.map(v => v.id === id ? { ...v, [field]: value } : v))
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* SolarWinds URL */}
            <Card>
                <CardHeader>
                    <CardTitle>SolarWinds Service Desk URL</CardTitle>
                    <CardDescription>Configure your SolarWinds Service Desk connection</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="solarwinds-url">Service Desk URL</Label>
                        <Input
                            id="solarwinds-url"
                            placeholder="https://your-instance.samanage.com"
                            value={solarWindsUrl}
                            onChange={(e) => setSolarWindsUrl(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Accent Color */}
            <Card>
                <CardHeader>
                    <CardTitle>Accent Color</CardTitle>
                    <CardDescription>Customize the accent color throughout the application</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Select value={accentColor} onValueChange={setAccentColor}>
                            <SelectTrigger id="accent-color">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(accentColors).map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded border"
                                                style={{
                                                    backgroundColor: `rgb(${accentColors[color as keyof typeof accentColors].light})`
                                                }}
                                            />
                                            <span className="capitalize">{color}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* View URLs */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ticket View Configuration</CardTitle>
                            <CardDescription>Add and name your SolarWinds ticket views</CardDescription>
                        </div>
                        <Button onClick={addViewUrl} size="sm" className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add View
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {viewUrls.map((view) => (
                            <div key={view.id} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={`view-name-${view.id}`}>View Name</Label>
                                    <Input
                                        id={`view-name-${view.id}`}
                                        placeholder="e.g., New Tickets"
                                        value={view.name}
                                        onChange={(e) => updateViewUrl(view.id, "name", e.target.value)}
                                    />
                                </div>
                                <div className="flex-2 space-y-2">
                                    <Label htmlFor={`view-url-${view.id}`}>View URL</Label>
                                    <Input
                                        id={`view-url-${view.id}`}
                                        placeholder="https://..."
                                        value={view.url}
                                        onChange={(e) => updateViewUrl(view.id, "url", e.target.value)}
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeViewUrl(view.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Application Refresh Rate */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle>Application Refresh Rate</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <HelpCircle className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>About Refresh Rates</DialogTitle>
                                    <DialogDescription className="space-y-2 pt-4">
                                        <p>
                                            This application is not real-time. Data is refreshed at the interval you set here.
                                        </p>
                                        <p>
                                            Setting a higher refresh rate (more frequent updates) may use more system resources because the application needs to refresh all content more often.
                                        </p>
                                        <p className="font-medium">
                                            For typical use, we recommend 5-10 minutes.
                                        </p>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <CardDescription>How often should the application refresh ticket data?</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="refresh-rate">Refresh Interval</Label>
                        <Select value={refreshRate} onValueChange={setRefreshRate}>
                            <SelectTrigger id="refresh-rate">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1min">1 minute</SelectItem>
                                <SelectItem value="5min">5 minutes</SelectItem>
                                <SelectItem value="10min">10 minutes</SelectItem>
                                <SelectItem value="15min">15 minutes</SelectItem>
                                <SelectItem value="30min">30 minutes</SelectItem>
                                <SelectItem value="1hr">1 hour</SelectItem>
                                <SelectItem value="2hr">2 hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription className="font-medium text-destructive">
                        NOTE: Notifications are not real time - do not become reliant
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Ticket Added to View */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Ticket Added to View</Label>
                        {Object.keys(viewNotifications).map((viewName) => (
                            <div key={viewName} className="flex items-center justify-between">
                                <Label htmlFor={`notify-${viewName}`} className="font-normal">
                                    {viewName}
                                </Label>
                                <Switch
                                    id={`notify-${viewName}`}
                                    checked={viewNotifications[viewName as keyof typeof viewNotifications]}
                                    onCheckedChange={(checked) =>
                                        setViewNotifications({ ...viewNotifications, [viewName]: checked })
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    {/* SLA Breach Warnings */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">SLA Breach Warning Times</Label>
                        <ToggleGroup type="multiple" value={slaBreachTimes} onValueChange={setSlaBreachTimes}>
                            <ToggleGroupItem value="5min">5 min</ToggleGroupItem>
                            <ToggleGroupItem value="10min">10 min</ToggleGroupItem>
                            <ToggleGroupItem value="15min">15 min</ToggleGroupItem>
                            <ToggleGroupItem value="30min">30 min</ToggleGroupItem>
                            <ToggleGroupItem value="1hr">1 hour</ToggleGroupItem>
                            <ToggleGroupItem value="2hr">2 hours</ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* Other Notifications */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notify-tagged" className="font-normal">
                                Notification when Tagged in Ticket
                            </Label>
                            <Switch
                                id="notify-tagged"
                                checked={notifyTagged}
                                onCheckedChange={setNotifyTagged}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notify-sync-fail" className="font-normal">
                                Notify When Syncing Fails
                            </Label>
                            <Switch
                                id="notify-sync-fail"
                                checked={notifySyncFails}
                                onCheckedChange={setNotifySyncFails}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notify-sync-refresh" className="font-normal">
                                Notify When Syncing Refreshes
                            </Label>
                            <Switch
                                id="notify-sync-refresh"
                                checked={notifySyncRefresh}
                                onCheckedChange={setNotifySyncRefresh}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}