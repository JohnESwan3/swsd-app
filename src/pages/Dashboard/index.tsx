//
// This is the homepage, users will be able to see their tickets per-"view". Views will be added in the settings
// page by copying and pasting the URLs. Then we can let the user filter by view or combine.
// - Filtered view by "views"
// - Each ticket title gives a URL to open it in the browser
// - Cards to show ammount of tickets, by priority
// - Notify the user when a new ticket enters a "view" (configurable in settings) with desktop notification
// - Filter notifications to search for the user being tagged in a ticket, then show desktop and app notification
// - Show tasks
// - Notify the user of tickets close to SLA breaches
// */

// Dummy Data + Components in one file - Needs split up into separate components later. Data will be filled in
// From Solar Winds
// */
import { useState, useEffect } from "react"
import {
    Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type Priority = "Low" | "Med" | "High" | "Critical"
type State = "Assigned" | "Awaiting Response" | "In Progress" | "On Hold" | "Pending Task Completion"
type Subcategory = "Installation" | "Password Reset" | "MFA Reset" | "Teams" | "Email" | "SAP" | "SXe" | "Microsoft Office" | "Workstation Hardware" | "Account Management" | "Entra"

interface Ticket {
    id: number
    title: string
    requester: string
    state: State
    priority: Priority
    category: string
    subcategory: Subcategory
    view: "New" | "Pending Assignment" | "Waiting"
}

interface Task {
    id: number
    title: string
    completed: boolean
    user: string
}

const MOCK_TICKETS: Ticket[] = [
    {
        id: 1,
        title: "Cannot access email on mobile device",
        requester: "John Smith",
        state: "Assigned",
        priority: "High",
        category: "Support",
        subcategory: "Email",
        view: "New"
    },
    {
        id: 2,
        title: "Password expired - need reset",
        requester: "Sarah Johnson",
        state: "In Progress",
        priority: "Med",
        category: "Support",
        subcategory: "Password Reset",
        view: "New"
    },
    {
        id: 3,
        title: "MFA not working after phone replacement",
        requester: "Mike Williams",
        state: "Awaiting Response",
        priority: "Critical",
        category: "Support",
        subcategory: "MFA Reset",
        view: "Pending Assignment"
    },
    {
        id: 4,
        title: "Teams keeps crashing during video calls",
        requester: "Emily Davis",
        state: "On Hold",
        priority: "Med",
        category: "Support",
        subcategory: "Teams",
        view: "Waiting"
    },
    {
        id: 5,
        title: "New employee needs SAP access",
        requester: "Robert Brown",
        state: "Pending Task Completion",
        priority: "Low",
        category: "Support",
        subcategory: "SAP",
        view: "Pending Assignment"
    },
    {
        id: 6,
        title: "Laptop keyboard keys not responding",
        requester: "Jennifer Garcia",
        state: "Assigned",
        priority: "High",
        category: "Support",
        subcategory: "Workstation Hardware",
        view: "New"
    },
    {
        id: 7,
        title: "Office 365 activation error",
        requester: "David Martinez",
        state: "In Progress",
        priority: "Med",
        category: "Support",
        subcategory: "Microsoft Office",
        view: "Waiting"
    },
    {
        id: 8,
        title: "User account locked in Entra",
        requester: "Lisa Anderson",
        state: "Assigned",
        priority: "Critical",
        category: "Support",
        subcategory: "Entra",
        view: "New"
    },
    {
        id: 9,
        title: "SXe installation needed for new user",
        requester: "James Wilson",
        state: "Awaiting Response",
        priority: "Low",
        category: "Support",
        subcategory: "SXe",
        view: "Pending Assignment"
    },
    {
        id: 10,
        title: "Offboarding - remove account access",
        requester: "Amanda Taylor",
        state: "In Progress",
        priority: "High",
        category: "Support",
        subcategory: "Account Management",
        view: "Waiting"
    }
]

const MOCK_TASKS: Task[] = [
    {
        id: 1,
        title: "Create AD account for John Doe",
        completed: false,
        user: "John Doe"
    },
    {
        id: 2,
        title: "Setup email for Sarah Miller",
        completed: true,
        user: "Sarah Miller"
    },
    {
        id: 3,
        title: "Configure workstation for new hire",
        completed: false,
        user: "Mike Thompson"
    },
    {
        id: 4,
        title: "Disable account - Tom Wilson (offboarding)",
        completed: false,
        user: "Tom Wilson"
    },
    {
        id: 5,
        title: "Add SAP access for Jennifer Lee",
        completed: false,
        user: "Jennifer Lee"
    },
    {
        id: 6,
        title: "Remove access - David Chen (terminated)",
        completed: true,
        user: "David Chen"
    },
    {
        id: 7,
        title: "Setup MFA for Amanda Park",
        completed: false,
        user: "Amanda Park"
    },
    {
        id: 8,
        title: "Create Entra ID account for Robert Kim",
        completed: false,
        user: "Robert Kim"
    }
]

const getPriorityColor = (priority: Priority) => {
    switch (priority) {
        case "Critical": return "destructive"
        case "High": return "destructive"
        case "Med": return "default"
        case "Low": return "secondary"
    }
}

const getStateColor = (state: State) => {
    switch (state) {
        case "Assigned": return "default"
        case "Awaiting Response": return "outline"
        case "In Progress": return "default"
        case "On Hold": return "secondary"
        case "Pending Task Completion": return "outline"
    }
}

type SortColumn = "title" | "requester" | "state" | "priority" | "subcategory"
type SortDirection = "asc" | "desc"

export default function Dashboard() {
    const [activeView, setActiveView] = useState<"All" | "New" | "Pending Assignment" | "Waiting">("All")
    const [selectedPriority, setSelectedPriority] = useState<"High" | "Med" | "Low">("High")
    const [sortColumn, setSortColumn] = useState<SortColumn | null>(() => {
        const saved = localStorage.getItem('ticket-sort-column')
        return saved ? (saved as SortColumn) : null
    })
    const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
        const saved = localStorage.getItem('ticket-sort-direction')
        return saved ? (saved as SortDirection) : "asc"
    })

    useEffect(() => {
        if (sortColumn) {
            localStorage.setItem('ticket-sort-column', sortColumn)
        } else {
            localStorage.removeItem('ticket-sort-column')
        }
    }, [sortColumn])

    useEffect(() => {
        localStorage.setItem('ticket-sort-direction', sortDirection)
    }, [sortDirection])

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const filteredTickets = activeView === "All"
        ? MOCK_TICKETS
        : MOCK_TICKETS.filter(ticket => ticket.view === activeView)

    const priorityOrder = { "Critical": 4, "High": 3, "Med": 2, "Low": 1 }

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        if (!sortColumn) return 0

        let comparison = 0
        switch (sortColumn) {
            case "title":
                comparison = a.title.localeCompare(b.title)
                break
            case "requester":
                comparison = a.requester.localeCompare(b.requester)
                break
            case "state":
                comparison = a.state.localeCompare(b.state)
                break
            case "priority":
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
                break
            case "subcategory":
                comparison = a.subcategory.localeCompare(b.subcategory)
                break
        }

        return sortDirection === "asc" ? comparison : -comparison
    })

    const priorityCounts = {
        Critical: MOCK_TICKETS.filter(t => t.priority === "Critical").length,
        High: MOCK_TICKETS.filter(t => t.priority === "High").length,
        Med: MOCK_TICKETS.filter(t => t.priority === "Med").length,
        Low: MOCK_TICKETS.filter(t => t.priority === "Low").length,
    }

    return(
        <div className="flex flex-col gap-6 p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Priority Selector Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Select value={selectedPriority} onValueChange={(v) => setSelectedPriority(v as any)}>
                                <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Med">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            <CardTitle className="text-sm font-medium">Priority</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-24">
                            <div className="space-y-1 pr-3">
                                {MOCK_TICKETS.filter(t => t.priority === selectedPriority).map((ticket) => (
                                    <a
                                        key={ticket.id}
                                        href="#"
                                        className="block text-sm py-1.5 px-2 hover:bg-accent rounded border-b last:border-b-0"
                                    >
                                        {ticket.title}
                                    </a>
                                ))}
                            </div>
                        </ScrollArea>
                        <p className="text-xs text-muted-foreground mt-2">{priorityCounts[selectedPriority]} tickets</p>
                    </CardContent>
                </Card>

                {/* Critical Priority Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Critical</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-24">
                            <div className="space-y-1 pr-3">
                                {MOCK_TICKETS.filter(t => t.priority === "Critical").map((ticket) => (
                                    <a
                                        key={ticket.id}
                                        href="#"
                                        className="block text-sm py-1.5 px-2 hover:bg-accent rounded border-b last:border-b-0"
                                    >
                                        {ticket.title}
                                    </a>
                                ))}
                            </div>
                        </ScrollArea>
                        <p className="text-xs text-muted-foreground mt-2">{priorityCounts.Critical} tickets</p>
                    </CardContent>
                </Card>

                {/* Tasks Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-24">
                            <div className="space-y-1 pr-3">
                                {MOCK_TASKS.slice(0, 6).map((task) => (
                                    <a
                                        key={task.id}
                                        href="#"
                                        className="block text-sm py-1.5 px-2 hover:bg-accent rounded border-b last:border-b-0"
                                    >
                                        {task.title}
                                    </a>
                                ))}
                            </div>
                        </ScrollArea>
                        <p className="text-xs text-muted-foreground mt-2">{MOCK_TASKS.filter(t => !t.completed).length} pending</p>
                    </CardContent>
                </Card>

                {/* Nearest SLA Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Nearest SLA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">02:34</div>
                        <p className="text-xs text-muted-foreground">Email Issue - John Smith</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tickets by View */}
            <Card>
                <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                    <CardDescription>View and manage your tickets by filter</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="New">New</TabsTrigger>
                            <TabsTrigger value="Pending Assignment">Pending Assignment</TabsTrigger>
                            <TabsTrigger value="Waiting">Waiting</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeView} className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer hover:bg-accent/50 select-none"
                                            onClick={() => handleSort("title")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Title
                                                {sortColumn === "title" ? (
                                                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-accent/50 select-none"
                                            onClick={() => handleSort("requester")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Requester
                                                {sortColumn === "requester" ? (
                                                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-accent/50 select-none"
                                            onClick={() => handleSort("state")}
                                        >
                                            <div className="flex items-center gap-2">
                                                State
                                                {sortColumn === "state" ? (
                                                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-accent/50 select-none"
                                            onClick={() => handleSort("priority")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Priority
                                                {sortColumn === "priority" ? (
                                                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-accent/50 select-none"
                                            onClick={() => handleSort("subcategory")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Subcategory
                                                {sortColumn === "subcategory" ? (
                                                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                )}
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedTickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>
                                                <a href="#" className="hover:underline font-medium">
                                                    {ticket.title}
                                                </a>
                                            </TableCell>
                                            <TableCell>{ticket.requester}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStateColor(ticket.state)}>
                                                    {ticket.state}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getPriorityColor(ticket.priority)}>
                                                    {ticket.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {ticket.subcategory}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}