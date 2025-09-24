import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Clock, CheckCircle, AlertCircle, User, Ticket, Trash, ArrowUpDown, X, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useTickets } from "@/hooks/useTickets";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { useLiveTime } from "@/hooks/useLiveTime";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Component for displaying ticket time with tooltip
const TicketTimeDisplay = ({ timestamp }: { timestamp: string }) => {
  const timeDisplay = useLiveTime(timestamp, 60000); // Update every minute
  
  return (
    <span title={`Created: ${timeDisplay.full}`}>
      {timeDisplay.relative}
    </span>
  );
};

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>("ticketApp_search", "");
  const [activeTab, setActiveTab] = useLocalStorage<string>("ticketApp_activeTab", "all");
  const [sortBy, setSortBy] = useLocalStorage<string>("ticketApp_sortBy", "newest");
  const { tickets, deleteTicket, syncWithLocalStorage } = useTickets();
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithLocalStorage();
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [syncWithLocalStorage]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    syncWithLocalStorage();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Function to parse time strings and convert to sortable values
  const parseTimeToMinutes = (timeStr: string): number => {
    const now = new Date();
    const lowerTimeStr = timeStr.toLowerCase();
    
    if (lowerTimeStr.includes("just now")) return 0;
    if (lowerTimeStr.includes("minute")) {
      const minutes = parseInt(lowerTimeStr.match(/(\d+)/)?.[1] || "0");
      return minutes;
    }
    if (lowerTimeStr.includes("hour")) {
      const hours = parseInt(lowerTimeStr.match(/(\d+)/)?.[1] || "0");
      return hours * 60;
    }
    if (lowerTimeStr.includes("day")) {
      const days = parseInt(lowerTimeStr.match(/(\d+)/)?.[1] || "0");
      return days * 24 * 60;
    }
    if (lowerTimeStr.includes("week")) {
      const weeks = parseInt(lowerTimeStr.match(/(\d+)/)?.[1] || "0");
      return weeks * 7 * 24 * 60;
    }
    if (lowerTimeStr.includes("month")) {
      const months = parseInt(lowerTimeStr.match(/(\d+)/)?.[1] || "0");
      return months * 30 * 24 * 60;
    }
    return 0;
  };

  // Function to get priority weight for sorting
  const getPriorityWeight = (priority: string): number => {
    const normalizedPriority = priority.toLowerCase();
    switch (normalizedPriority) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
      default: return 0;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    // Enhanced search logic
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = searchLower === "" || 
                         ticket.title.toLowerCase().includes(searchLower) ||
                         ticket.description.toLowerCase().includes(searchLower) ||
                         ticket.id.toLowerCase().includes(searchLower) ||
                         ticket.assignee.toLowerCase().includes(searchLower) ||
                         ticket.category.toLowerCase().includes(searchLower) ||
                         (ticket.tags && ticket.tags.some(tag => tag.toLowerCase().includes(searchLower)));
    
    const matchesTab = activeTab === "all" || ticket.status.toLowerCase().replace(" ", "") === activeTab;
    
    // Debug logging (only for troubleshooting)
    if (searchTerm && searchTerm.trim() !== "" && process.env.NODE_ENV === 'development') {
      console.log(`Search: "${searchTerm}" | Ticket: ${ticket.id} | Matches: ${matchesSearch}`);
    }
    
    return matchesSearch && matchesTab;
  });

  // Sort tickets based on selected criteria
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return parseTimeToMinutes(a.created) - parseTimeToMinutes(b.created);
      case "newest":
        return parseTimeToMinutes(b.created) - parseTimeToMinutes(a.created);
      case "priority-high":
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      case "priority-low":
        return getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
      case "updated-oldest":
        return parseTimeToMinutes(a.updated) - parseTimeToMinutes(b.updated);
      case "updated-newest":
        return parseTimeToMinutes(b.updated) - parseTimeToMinutes(a.updated);
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    
    // Debug logging for priority colors
    if (process.env.NODE_ENV === 'development') {
      console.log(`Priority: "${priority}" -> Normalized: "${normalizedPriority}"`);
    }
    
    switch (normalizedPriority) {
      case "high": return "bg-destructive/20 text-destructive";
      case "medium": return "bg-warning/20 text-warning";
      case "low": return "bg-success/20 text-success";
      default: 
        console.warn(`Unknown priority: "${priority}"`);
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-primary/20 text-primary";
      case "In Progress": return "bg-secondary/20 text-secondary-foreground";
      case "Resolved": return "bg-success/20 text-success";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return Clock;
      case "In Progress": return AlertCircle;
      case "Resolved": return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All Tickets
            </h1>
            <p className="text-muted-foreground">
              Manage and track all support tickets
              <span className="text-xs ml-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="hover:scale-105 transition-transform duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/tickets/create">
              <Button className="gradient-button hover:scale-105 transition-transform duration-200 animate-pulse-glow">
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets by title, description, ID, assignee, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority-high">Priority: High to Low</SelectItem>
                <SelectItem value="priority-low">Priority: Low to High</SelectItem>
                <SelectItem value="updated-newest">Recently Updated</SelectItem>
                <SelectItem value="updated-oldest">Least Recently Updated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Search Results Info */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4"
          >
            <p className="text-sm text-muted-foreground">
              {sortedTickets.length === 0 ? (
                <>No tickets found for "<span className="font-medium text-foreground">{searchTerm}</span>"</>
              ) : (
                <>
                  {sortedTickets.length} ticket{sortedTickets.length !== 1 ? 's' : ''} found for "<span className="font-medium text-foreground">{searchTerm}</span>"
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="inprogress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid gap-4">
                {sortedTickets.map((ticket, index) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                      whileHover={{ 
                        scale: 1.02, 
                        rotateY: 2,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                      className="group"
                    >
                      <Link to={`/tickets/${ticket.id}`}>
                        <Card className="gradient-card border-border/20 shadow-card hover:shadow-primary/20 transition-all duration-300 cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {ticket.id}
                                  </Badge>
                                  <Badge className={getPriorityColor(ticket.priority)}>
                                    {ticket.priority}
                                  </Badge>
                                  <Badge className={getStatusColor(ticket.status)}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {ticket.status}
                                  </Badge>
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">
                                  {ticket.title}
                                </CardTitle>
                              </div>
                              <div className="ml-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:text-destructive"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogTitle>Delete {ticket.id}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the ticket "{ticket.title}".
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={() => {
                                          deleteTicket(ticket.id);
                                          toast({
                                            title: "Ticket deleted",
                                            description: `${ticket.id} has been removed.`,
                                          });
                                        }}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {ticket.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{ticket.assignee}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {ticket.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div>Created <TicketTimeDisplay timestamp={ticket.created} /></div>
                                <div>Updated <TicketTimeDisplay timestamp={ticket.updated} /></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              {sortedTickets.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "No tickets match the current filter"}
                  </p>
                  <Link to="/tickets/create">
                    <Button className="gradient-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Ticket
                    </Button>
                  </Link>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Tickets;