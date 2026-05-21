// Testimonial type for type safety
export type Testimonial = {
  id: string;
  clientName: string;
  content: string;
  rating: number;
  position: string;
  company: string;
  imageUrl: string;
  createdAt: string;
};

// Exported array of testimonials
export const testimonials: Testimonial[] = [
  {
    id: "1",
    clientName: "Elijah Omachoko",
    content:
      "Achek built us a world-class real estate website with seamless property listings. The design is modern and user-friendly, and our leads have doubled.",
    rating: 5,
    position: "Founder",
    company: "Achekinyo",
    imageUrl: "https://i.ibb.co/yFC1hZxP/elijah.jpg",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    clientName: "Victoria Onuche",
    content:
      "Their developer portfolio platform was beyond my expectations. Clean, fast, and professional. It has helped me attract bigger clients.",
    rating: 5,
    position: "Software Developer",
    company: "Freelance",
    imageUrl: "https://i.ibb.co/q39dDm3p/victoria.jpg",
    createdAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "3",
    clientName: "Sarah Johnson",
    content:
      "Achek transformed our online presence completely. The team delivered a stunning website that not only looks amazing but also performs exceptionally well.",
    rating: 5,
    position: "CEO",
    company: "TechCorp",
    imageUrl:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    createdAt: "2023-01-03T00:00:00Z",
  },
  {
    id: "4",
    clientName: "Michael Chen",
    content:
      "The mobile app they developed for us exceeded all expectations. The user experience is seamless, and our customers love the intuitive design.",
    rating: 5,
    position: "Founder",
    company: "FitLife",
    imageUrl:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    createdAt: "2023-01-04T00:00:00Z",
  },
  {
    id: "5",
    clientName: "Emily Rodriguez",
    content:
      "Working with Achek was a game-changer for our business. They understood our vision perfectly and delivered a solution that surpassed our expectations.",
    rating: 5,
    position: "Director",
    company: "GreenEarth",
    imageUrl:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
    createdAt: "2023-01-05T00:00:00Z",
  },
  {
    id: "6",
    clientName: "David Thompson",
    content:
      "Achek's digital marketing strategy helped us reach new heights. Our online visibility has improved dramatically with consistent growth in leads.",
    rating: 5,
    position: "Owner",
    company: "LocalBiz",
    imageUrl:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
    createdAt: "2023-01-06T00:00:00Z",
  },
  {
    id: "7",
    clientName: "Lisa Park",
    content:
      "The e-commerce platform Achek built for us is absolutely fantastic. The admin panel is intuitive, and our customers love the shopping experience.",
    rating: 5,
    position: "Founder",
    company: "StyleHub",
    imageUrl:
      "https://images.pexels.com/photos/774282/pexels-photo-774282.jpeg",
    createdAt: "2023-01-07T00:00:00Z",
  },
  {
    id: "8",
    clientName: "Robert Kim",
    content:
      "From concept to deployment, Achek handled everything professionally. Their cloud solutions made our operations more efficient and scalable.",
    rating: 5,
    position: "CTO",
    company: "InnovateTech",
    imageUrl:
      "https://images.pexels.com/photos/2422273/pexels-photo-2422273.jpeg",
    createdAt: "2023-01-08T00:00:00Z",
  },
  {
    id: "9",
    clientName: "Chinedu Okafor",
    content:
      "Our fintech dashboard was delivered flawlessly. Real-time analytics, easy navigation, and a polished UI. Couldn’t have asked for better.",
    rating: 5,
    position: "Product Manager",
    company: "FinPay",
    imageUrl:
      "https://images.pexels.com/photos/936094/pexels-photo-936094.jpeg",
    createdAt: "2023-01-09T00:00:00Z",
  },
  {
    id: "10",
    clientName: "Amara Nwosu",
    content:
      "Achek created a beautiful learning platform for us. Students love the experience and engagement has skyrocketed since launch.",
    rating: 5,
    position: "Director",
    company: "EduAfrica",
    imageUrl:
      "https://refinedng.com/wp-content/uploads/2024/03/Honey-Ogundeyi-CEO.png",
    createdAt: "2023-01-10T00:00:00Z",
  },
  {
    id: "11",
    clientName: "Tunde Balogun",
    content:
      "Their food delivery solution for us was smooth, real-time, and scalable. Our restaurants and customers love the system.",
    rating: 5,
    position: "CEO",
    company: "QuickEats NG",
    imageUrl:
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
    createdAt: "2023-01-11T00:00:00Z",
  },
  {
    id: "12",
    clientName: "Ngozi Adeyemi",
    content:
      "Achek’s real estate platform was exactly what we needed. Virtual tours and mortgage calculators set us apart from competitors.",
    rating: 5,
    position: "Manager",
    company: "Lagos Realty",
    imageUrl:
      "https://images.pexels.com/photos/1002061/pexels-photo-1002061.jpeg",
    createdAt: "2023-01-12T00:00:00Z",
  },
];