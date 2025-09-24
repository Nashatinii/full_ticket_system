import { useLocalStorage } from './useLocalStorage';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  category: string;
  assignee: string;
  created: string;
  updated: string;
  comments?: Comment[];
  tags?: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const initialTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "Login page not loading",
    description: "Users are unable to access the login page due to a server error",
    priority: "High",
    status: "Open",
    category: "Bug",
    assignee: "Sarah Johnson",
    created: "2 hours ago",
    updated: "1 hour ago",
    tags: ["authentication", "frontend", "critical"],
    comments: [
      {
        id: "1",
        author: "Sarah Johnson",
        content: "I'm investigating this issue. It seems to be related to the server configuration.",
        timestamp: "1 hour ago"
      }
    ]
  },
  {
    id: "TK-002",
    title: "Dashboard performance issue",
    description: "Dashboard takes too long to load with large datasets",
    priority: "Medium",
    status: "In Progress",
    category: "Performance",
    assignee: "Mike Chen",
    created: "5 hours ago",
    updated: "3 hours ago",
    tags: ["performance", "database"],
    comments: [
      {
        id: "2",
        author: "Mike Chen",
        content: "Working on optimizing the database queries. Should have a fix by tomorrow.",
        timestamp: "3 hours ago"
      }
    ]
  },
  {
    id: "TK-003",
    title: "Export feature request",
    description: "Users need ability to export data to CSV format",
    priority: "Low",
    status: "Open",
    category: "Feature",
    assignee: "Alex Smith",
    created: "1 day ago",
    updated: "1 day ago",
    tags: ["export", "csv"],
  },
  {
    id: "TK-004",
    title: "Mobile app crashing",
    description: "App crashes when opening notifications on iOS devices",
    priority: "High",
    status: "Resolved",
    category: "Bug",
    assignee: "Emma Wilson",
    created: "2 days ago",
    updated: "6 hours ago",
    tags: ["mobile", "ios", "crash"],
    comments: [
      {
        id: "3",
        author: "Emma Wilson",
        content: "Fixed the iOS notification crash. Deployed to production.",
        timestamp: "6 hours ago"
      }
    ]
  },
  {
    id: "TK-005",
    title: "Dark mode implementation",
    description: "Add dark mode support across all pages",
    priority: "Medium",
    status: "In Progress",
    category: "Feature",
    assignee: "David Brown",
    created: "3 days ago",
    updated: "1 day ago",
    tags: ["ui", "dark-mode"],
  },
  {
    id: "TK-006",
    title: "Database optimization",
    description: "Optimize database queries for better performance",
    priority: "Low",
    status: "Open",
    category: "Performance",
    assignee: "Lisa Garcia",
    created: "4 days ago",
    updated: "2 days ago",
    tags: ["database", "optimization"],
  },
];

export function useTickets() {
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('ticketApp_tickets', initialTickets);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'created' | 'updated' | 'status'>) => {
    // Generate unique ID by finding the highest existing ID and incrementing
    const existingIds = tickets.map(ticket => {
      const idNumber = parseInt(ticket.id.replace('TK-', ''));
      return isNaN(idNumber) ? 0 : idNumber;
    });
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = `TK-${String(maxId + 1).padStart(3, '0')}`;

    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      status: 'Open',
      created: 'Just now',
      updated: 'Just now',
      comments: [],
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updated: 'Just now' }
          : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const addComment = (ticketId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: 'Just now',
    };

    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              comments: [...(ticket.comments || []), newComment],
              updated: 'Just now'
            }
          : ticket
      )
    );
  };

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const getStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const highPriority = tickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length;

    return {
      total,
      open,
      inProgress,
      resolved,
      highPriority,
    };
  };

  const getRecentTickets = (limit = 3) => {
    return tickets
      .filter(t => t.status !== 'Resolved')
      .slice(0, limit);
  };

  // Function to sync tickets with localStorage (useful for debugging)
  const syncWithLocalStorage = () => {
    try {
      const stored = window.localStorage.getItem('ticketApp_tickets');
      if (stored) {
        const parsedTickets = JSON.parse(stored);
        setTickets(parsedTickets);
        return parsedTickets;
      }
    } catch (error) {
      console.error('Error syncing with localStorage:', error);
    }
    return tickets;
  };

  // Function to clear all tickets from localStorage
  const clearAllTickets = () => {
    setTickets([]);
  };

  // Function to reset to initial tickets
  const resetToInitialTickets = () => {
    setTickets(initialTickets);
  };

  return {
    tickets,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    getTicketById,
    getStats,
    getRecentTickets,
    syncWithLocalStorage,
    clearAllTickets,
    resetToInitialTickets,
  };
}