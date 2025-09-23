import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Target
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Reports = () => {
  // Mock data for charts
  const monthlyData = [
    { month: "Jan", created: 45, resolved: 42, open: 3 },
    { month: "Feb", created: 52, resolved: 48, open: 4 },
    { month: "Mar", created: 38, resolved: 41, open: -3 },
    { month: "Apr", created: 61, resolved: 55, open: 6 },
    { month: "May", created: 73, resolved: 68, open: 5 },
    { month: "Jun", created: 56, resolved: 62, open: -6 },
  ];

  const priorityData = [
    { name: "High", value: 23, color: "hsl(var(--destructive))" },
    { name: "Medium", value: 45, color: "hsl(var(--warning))" },
    { name: "Low", value: 32, color: "hsl(var(--success))" },
  ];

  const categoryData = [
    { category: "Bug", count: 34 },
    { category: "Feature", count: 28 },
    { category: "Improvement", count: 19 },
    { category: "Task", count: 15 },
    { category: "Question", count: 4 },
  ];

  const resolutionTimeData = [
    { day: "Mon", avgHours: 4.2 },
    { day: "Tue", avgHours: 3.8 },
    { day: "Wed", avgHours: 5.1 },
    { day: "Thu", avgHours: 2.9 },
    { day: "Fri", avgHours: 6.2 },
    { day: "Sat", avgHours: 3.5 },
    { day: "Sun", avgHours: 2.1 },
  ];

  const kpiData = [
    {
      title: "Resolution Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      description: "Tickets resolved vs created",
    },
    {
      title: "Avg Resolution Time",
      value: "4.2h",
      change: "-0.8h",
      trend: "down",
      icon: Clock,
      description: "Average time to resolve",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Users,
      description: "Based on feedback surveys",
    },
    {
      title: "First Response Time",
      value: "1.2h",
      change: "-0.3h",
      trend: "down",
      icon: AlertTriangle,
      description: "Time to first agent response",
    },
  ];

  const [activeTab, setActiveTab] = useLocalStorage<string>("ticketApp_reportsTab", "overview");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your ticket management performance
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="gradient-card border-border/20 shadow-card hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`${
                        kpi.trend === "up"
                          ? "text-success border-success/20 bg-success/10"
                          : "text-success border-success/20 bg-success/10"
                      }`}
                    >
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {kpi.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Ticket Trends
                  </CardTitle>
                  <CardDescription>
                    Track ticket creation and resolution patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="created"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.6)"
                        name="Created"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stackId="2"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success) / 0.6)"
                        name="Resolved"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="priority" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="gradient-card border-border/20 shadow-card">
                  <CardHeader>
                    <CardTitle>Priority Distribution</CardTitle>
                    <CardDescription>
                      Current distribution of tickets by priority level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          nameKey="name"
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="gradient-card border-border/20 shadow-card">
                  <CardHeader>
                    <CardTitle>Priority Breakdown</CardTitle>
                    <CardDescription>
                      Detailed view of priority levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {priorityData.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.name} Priority</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.value}</div>
                          <div className="text-xs text-muted-foreground">tickets</div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="category" className="space-y-6">
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <CardTitle>Tickets by Category</CardTitle>
                  <CardDescription>
                    Distribution of tickets across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="category" 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        name="Tickets"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <CardTitle>Average Resolution Time</CardTitle>
                  <CardDescription>
                    Daily average time to resolve tickets (in hours)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={resolutionTimeData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis 
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgHours"
                        stroke="hsl(var(--accent))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 6 }}
                        name="Avg Hours"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Reports;