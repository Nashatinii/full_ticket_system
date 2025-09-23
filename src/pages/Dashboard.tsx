import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useTickets } from "@/hooks/useTickets";

const Dashboard = () => {
  const { getStats, getRecentTickets } = useTickets();
  const stats = getStats();
  const recentTickets = getRecentTickets();

  const statsConfig = [
    {
      title: "Total Tickets",
      value: stats.total.toString(),
      description: "All time tickets",
      icon: Ticket,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Open Tickets",
      value: stats.open.toString(),
      description: "Currently active",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Resolved",
      value: stats.resolved.toString(),
      description: "Successfully closed",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "High Priority",
      value: stats.highPriority.toString(),
      description: "Needs attention",
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your tickets.</p>
          </div>
          <Link to="/tickets/create">
            <Button className="gradient-button hover:scale-105 transition-transform duration-200 animate-pulse-glow">
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="gradient-card border-border/20 shadow-card hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="gradient-card border-border/20 shadow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Tickets</CardTitle>
                  <CardDescription>Latest tickets requiring attention</CardDescription>
                </div>
                <Link to="/tickets">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ticket.priority === "High"
                              ? "bg-destructive/20 text-destructive"
                              : ticket.priority === "Medium"
                              ? "bg-warning/20 text-warning"
                              : "bg-success/20 text-success"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === "Open"
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-secondary-foreground"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Assigned to {ticket.assignee} • {ticket.created}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;