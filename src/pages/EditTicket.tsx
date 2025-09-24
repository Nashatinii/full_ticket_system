import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { formatTimestamp } from "@/lib/timeUtils";

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTicketById, updateTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const ticket = getTicketById(id || "");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    category: "",
    assignee: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority.toLowerCase(),
        status: ticket.status.toLowerCase().replace(" ", ""),
        category: ticket.category.toLowerCase(),
        assignee: ticket.assignee.toLowerCase().replace(" ", ""),
      });
    }
  }, [ticket]);

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

  const priorities = [
    { value: "low", label: "Low", color: "text-success" },
    { value: "medium", label: "Medium", color: "text-warning" },
    { value: "high", label: "High", color: "text-destructive" },
  ];

  const statuses = [
    { value: "open", label: "Open" },
    { value: "inprogress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  const categories = [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature Request" },
    { value: "improvement", label: "Improvement" },
    { value: "task", label: "Task" },
    { value: "question", label: "Question" },
    { value: "performance", label: "Performance" },
  ];

  const assignees = [
    { value: "sarah", label: "Sarah Johnson" },
    { value: "mike", label: "Mike Chen" },
    { value: "alex", label: "Alex Smith" },
    { value: "emma", label: "Emma Wilson" },
    { value: "david", label: "David Brown" },
    { value: "lisa", label: "Lisa Garcia" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "There are validation errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const assigneeMap: Record<string, string> = {
        sarah: "Sarah Johnson",
        mike: "Mike Chen",
        alex: "Alex Smith",
        emma: "Emma Wilson",
        david: "David Brown",
        lisa: "Lisa Garcia",
      };

      // Convert priority to proper case
      const priorityMap: Record<string, 'Low' | 'Medium' | 'High'> = {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      };

      // Convert status to proper case
      const statusMap: Record<string, 'Open' | 'In Progress' | 'Resolved'> = {
        open: 'Open',
        inprogress: 'In Progress',
        resolved: 'Resolved',
      };

      // Convert category to proper case
      const categoryMap: Record<string, string> = {
        bug: 'Bug',
        feature: 'Feature',
        improvement: 'Improvement',
        task: 'Task',
        question: 'Question',
        performance: 'Performance',
      };

      const updates: Partial<Ticket> = {
        title: formData.title,
        description: formData.description,
        priority: priorityMap[formData.priority] || 'Low',
        status: statusMap[formData.status] || 'Open',
        category: categoryMap[formData.category] || formData.category,
        assignee: formData.assignee ? assigneeMap[formData.assignee] : ticket.assignee,
      };

      updateTicket(ticket.id, updates);
      
      const timeDisplay = formatTimestamp(updates.updated || ticket.updated);
      toast({
        title: "Ticket updated successfully!",
        description: `Ticket ${ticket.id} has been updated at ${timeDisplay.absolute}.`,
      });
      
      setIsSubmitting(false);
      navigate(`/tickets/${ticket.id}`);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="hover:scale-110 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Edit Ticket {ticket.id}
            </h1>
            <p className="text-muted-foreground">Update ticket information and status</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="gradient-card border-border/20 shadow-card">
            <CardHeader>
              <CardTitle>Edit Ticket Details</CardTitle>
              <CardDescription>
                Update the ticket information below. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </div>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </div>
                  )}
                </motion.div>

                {/* Priority, Status, and Category Row */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Priority */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label>
                      Priority <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange("priority", value)}
                    >
                      <SelectTrigger className={errors.priority ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <span className={priority.color}>{priority.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.priority && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.priority}
                      </div>
                    )}
                  </motion.div>

                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label>
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.status}
                      </div>
                    )}
                  </motion.div>

                  {/* Category */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label>
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.category}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Assignee */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label>Assign to</Label>
                  <Select
                    value={formData.assignee}
                    onValueChange={(value) => handleInputChange("assignee", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee.value} value={assignee.value}>
                          {assignee.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex gap-4 pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gradient-button hover:scale-105 transition-transform duration-200 animate-pulse-glow"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Updating Ticket..." : "Update Ticket"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default EditTicket;
