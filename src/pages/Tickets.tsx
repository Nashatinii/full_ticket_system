import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Clock, CheckCircle, AlertCircle, User, Ticket, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useTickets } from "@/hooks/useTickets";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
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

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>("ticketApp_search", "");
  const [activeTab, setActiveTab] = useLocalStorage<string>("ticketApp_activeTab", "all");
  const { tickets, deleteTicket } = useTickets();
  const { toast } = useToast();

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || ticket.status.toLowerCase().replace(" ", "") === activeTab;
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive/20 text-destructive";
      case "Medium": return "bg-warning/20 text-warning";
      case "Low": return "bg-success/20 text-success";
      default: return "bg-muted/20 text-muted-foreground";
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
            <p className="text-muted-foreground">Manage and track all support tickets</p>
          </div>
          <Link to="/tickets/create">
            <Button className="gradient-button hover:scale-105 transition-transform duration-200 animate-pulse-glow">
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </Link>
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
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </motion.div>

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
                {filteredTickets.map((ticket, index) => {
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
                                <div>Created {ticket.created}</div>
                                <div>Updated {ticket.updated}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              {filteredTickets.length === 0 && (
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