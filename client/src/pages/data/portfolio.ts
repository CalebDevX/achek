// PortfolioProject type for type safety
export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  createdAt: string;
};

// Exported array of portfolio projects
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "1",
    title: "FinPay NG",
    description:
      "A modern fintech dashboard for Nigerian SMEs. Provides real-time analytics, payments integration, and automated invoicing.",
    techStack: ["Next.js", "TailwindCSS", "Node.js", "PostgreSQL"],
    imageUrl:
      "https://images.pexels.com/photos/6802040/pexels-photo-6802040.jpeg",
    liveUrl: "/FintechDashboard",
    githubUrl: "https://github.com/calebdevx/finpay-ng",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    // (End of array, file is now clean and ready for frontend use)
    id: "3",
    title: "NaijaHomes",
    description:
      "A real estate platform with property listings, mortgage calculators, and virtual tours tailored for Nigerian buyers.",
    techStack: ["Next.js", "Supabase", "TailwindCSS"],
    imageUrl:
      "https://images.pexels.com/photos/7031409/pexels-photo-7031409.jpeg",
    liveUrl: "/RealEstate",
    githubUrl: "https://github.com/yourgithub/naijahomes",
    createdAt: "2023-01-03T00:00:00Z",
  },
  {
    id: "4",
    title: "EduAfrica LMS",
    description:
      "An e-learning platform for African universities. Includes video streaming, quizzes, and student progress tracking.",
    techStack: ["Django", "React", "PostgreSQL"],
    imageUrl:
      "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg",
    liveUrl: "/eduafrica",
    githubUrl: "https://github.com/calebdevx/eduafrica",
    createdAt: "2023-01-04T00:00:00Z",
  },
  {
    id: "5",
    title: "MarketHub NG",
    description:
      "An e-commerce marketplace that connects Nigerian vendors with nationwide customers. Features wallet, cart, and seller dashboards.",
    techStack: ["Vue.js", "Laravel", "MySQL"],
    imageUrl:
      "https://images.pexels.com/photos/5632396/pexels-photo-5632396.jpeg",
    liveUrl: "/Marketplace",
    githubUrl: "https://github.com/calebdevx/markethub-ng",
    createdAt: "2023-01-05T00:00:00Z",
  },
  {
    id: "6",
    title: "TravelNaija",
    description:
      "Tourism booking platform for Nigerian destinations. Provides flight deals, hotel booking, and local experiences.",
    techStack: ["Next.js", "GraphQL", "TailwindCSS"],
    imageUrl:
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    liveUrl: "/travelnaija",
    githubUrl: "https://github.com/calebdevx/travelnaija",
    createdAt: "2023-01-06T00:00:00Z",
  },
  {
    id: "7",
    title: "AgroConnect",
    description:
      "A digital marketplace connecting Nigerian farmers to buyers. Features crop tracking, pricing analytics, and secure payments.",
    techStack: ["React", "Node.js", "MongoDB"],
    imageUrl:
      "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg",
    liveUrl: "/AgroConnect",
    githubUrl: "https://github.com/calebdevx/agroconnect",
    createdAt: "2023-01-07T00:00:00Z",
  },
  {
    id: "8",
    title: "HealthLink NG",
    description:
      "Telemedicine platform offering video consultations, prescriptions, and hospital integrations for Nigerian healthcare.",
    techStack: ["Flutter", "Firebase", "NestJS"],
    imageUrl:
      "https://images.pexels.com/photos/4266947/pexels-photo-4266947.jpeg",
    liveUrl: "/healthlink",
    githubUrl: "https://github.com/calebdevx/healthlink-ng",
    createdAt: "2023-01-08T00:00:00Z",
  },
  {
    id: "9",
    title: "EventHub Africa",
    description:
      "Event ticketing and booking solution for concerts, conferences, and weddings across Nigeria.",
    techStack: ["Angular", "Express", "MongoDB"],
    imageUrl:
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    liveUrl: "/EventHub",
    githubUrl: "https://github.com/calebdevx/eventhubafrica",
    createdAt: "2023-01-09T00:00:00Z",
  },
  {
    id: "10",
    title: "ShopSmart NG",
    description:
      "AI-powered price comparison platform for Nigerian online shoppers. Helps users find the best deals instantly.",
    techStack: ["Next.js", "AI API", "PostgreSQL"],
    imageUrl:
      "https://images.pexels.com/photos/5632393/pexels-photo-5632393.jpeg",
    liveUrl: "/shopsmart",
    githubUrl: "https://github.com/calebdevx/shopsmart-ng",
    createdAt: "2023-01-10T00:00:00Z",
  },
];
