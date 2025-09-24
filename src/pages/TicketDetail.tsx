import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  Edit
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTickets } from "@/hooks/useTickets";
import { useAuth } from "@/hooks/useAuth";
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
    <span title={`Time: ${timeDisplay.full}`}>
      {timeDisplay.relative}
    </span>
  );
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTicketById, updateTicket, addComment, deleteTicket } = useTickets();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const ticket = getTicketById(id || "");

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
            <Button onClick={() => navigate("/tickets")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    setIsSubmittingComment(true);
    
    // Add comment using the hook
    addComment(ticket.id, {
      author: user.name,
      content: newComment.trim(),
    });
    
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
    
    setNewComment("");
    setIsSubmittingComment(false);
  };

  const handleStatusChange = (newStatus: string) => {
    updateTicket(ticket.id, { 
      status: newStatus as 'Open' | 'In Progress' | 'Resolved' 
    });
    
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };

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

  const StatusIcon = getStatusIcon(ticket.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/tickets")}
            className="hover:scale-110 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {ticket.title}
            </h1>
            <p className="text-muted-foreground">Ticket {ticket.id}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono">
                          {ticket.id}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {ticket.status}
                        </Badge>
                        <Badge variant="secondary">{ticket.category}</Badge>
                      </div>
                       {ticket.tags && ticket.tags.map((tag) => (
                         <Badge key={tag} variant="outline" className="mr-1 text-xs">
                           #{tag}
                         </Badge>
                       ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Delete
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
                                navigate("/tickets");
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({ticket.comments?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Comments List */}
                  <div className="space-y-4">
                    {ticket.comments?.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              <TicketTimeDisplay timestamp={comment.timestamp} />
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  {/* Add Comment */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Add a comment</label>
                    <Textarea
                      placeholder="Type your comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="gradient-button hover:scale-105 transition-transform duration-200"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmittingComment ? "Adding..." : "Add Comment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Ticket Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned to</p>
                      <p className="font-medium">{ticket.assignee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                     <div>
                       <p className="text-sm text-muted-foreground">Reporter</p>
                       <p className="font-medium">{user?.name || "Unknown"}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium"><TicketTimeDisplay timestamp={ticket.created} /></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last updated</p>
                      <p className="font-medium"><TicketTimeDisplay timestamp={ticket.updated} /></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="gradient-card border-border/20 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleStatusChange("In Progress")}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Start Progress
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleStatusChange("Resolved")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                  <Button 
                    className="w-full justify-start gradient-button"
                    onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Ticket
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;