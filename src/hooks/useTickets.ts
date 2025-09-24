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

// Helper function to create dates relative to now
const createRelativeDate = (hoursAgo: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

const createRelativeDateDays = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const initialTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "Login page not loading",
    description: "Users are unable to access the login page due to a server error",
    priority: "High",
    status: "Open",
    category: "Bug",
    assignee: "Sarah Johnson",
    created: createRelativeDate(2),
    updated: createRelativeDate(1),
    tags: ["authentication", "frontend", "critical"],
    comments: [
      {
        id: "1",
        author: "Sarah Johnson",
        content: "I'm investigating this issue. It seems to be related to the server configuration.",
        timestamp: createRelativeDate(1)
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
    created: createRelativeDate(5),
    updated: createRelativeDate(3),
    tags: ["performance", "database"],
    comments: [
      {
        id: "2",
        author: "Mike Chen",
        content: "Working on optimizing the database queries. Should have a fix by tomorrow.",
        timestamp: createRelativeDate(3)
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
    created: createRelativeDateDays(1),
    updated: createRelativeDateDays(1),
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
    created: createRelativeDateDays(2),
    updated: createRelativeDate(6),
    tags: ["mobile", "ios", "crash"],
    comments: [
      {
        id: "3",
        author: "Emma Wilson",
        content: "Fixed the iOS notification crash. Deployed to production.",
        timestamp: createRelativeDate(6)
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
    created: createRelativeDateDays(3),
    updated: createRelativeDateDays(1),
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
    created: createRelativeDateDays(4),
    updated: createRelativeDateDays(2),
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

    const now = new Date();
    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      status: 'Open',
      created: now.toISOString(),
      updated: now.toISOString(),
      comments: [],
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updated: new Date().toISOString() }
          : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const addComment = (ticketId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const now = new Date();
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: now.toISOString(),
    };

    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              comments: [...(ticket.comments || []), newComment],
              updated: now.toISOString()
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