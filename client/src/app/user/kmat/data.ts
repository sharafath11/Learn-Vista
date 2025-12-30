export type SectionId = "quantitative" | "logical" | "verbal" | "gk";

export interface Question {
  id: number;
  section: SectionId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "quantitative", label: "Quantitative" },
  { id: "logical", label: "Logical" },
  { id: "verbal", label: "Verbal" },
  { id: "gk", label: "Gen. Knowledge" },
];

export const examQuestions: Question[] = [
  // Quantitative
  { 
    id: 1, 
    section: "quantitative", 
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", 
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correctAnswer: "150 metres",
    explanation: "Speed = 60*(5/18) m/sec = 50/3 m/sec. Length = Speed x Time = (50/3) * 9 = 150 metres."
  },
  { 
    id: 2, 
    section: "quantitative", 
    question: "The ratio of the cost price and the selling price is 4:5. The profit percent is:", 
    options: ["10%", "20%", "25%", "30%"],
    correctAnswer: "25%",
    explanation: "Let CP = 4x, SP = 5x. Profit = x. Profit % = (x/4x)*100 = 25%."
  },
  { 
    id: 3, 
    section: "quantitative", 
    question: "What is 20% of 50% of 75% of 80?", 
    options: ["5", "6", "7.5", "8"],
    correctAnswer: "6",
    explanation: "20/100 * 50/100 * 75/100 * 80 = 1/5 * 1/2 * 3/4 * 80 = 6."
  },
  
  // Logical
  { 
    id: 4, 
    section: "logical", 
    question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", 
    options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
    correctAnswer: "(1/8)",
    explanation: "This is a simple division series; each number is one-half of the previous number."
  },
  { 
    id: 5, 
    section: "logical", 
    question: "Which word does NOT belong with the others?", 
    options: ["Index", "Glossary", "Chapter", "Book"],
    correctAnswer: "Book",
    explanation: "Index, Glossary, and Chapter are parts of a Book. Book is the whole."
  },
  
  // Verbal
  { 
    id: 6, 
    section: "verbal", 
    question: "Select the word that means the same as 'Candid'.", 
    options: ["Secretive", "Frank", "Vague", "Dishonest"],
    correctAnswer: "Frank",
    explanation: "Candid means truthful and straightforward; frank."
  },
  { 
    id: 7, 
    section: "verbal", 
    question: "Antonym of 'Advance':", 
    options: ["Retreat", "Hold", "Defend", "Attack"],
    correctAnswer: "Retreat",
    explanation: "Advance means to move forward, Retreat means to move back."
  },

  // GK
  { 
    id: 8, 
    section: "gk", 
    question: "Who is the current Governor of RBI?", 
    options: ["Raghuram Rajan", "Shaktikanta Das", "Urjit Patel", "D. Subbarao"],
    correctAnswer: "Shaktikanta Das",
    explanation: "Shaktikanta Das served as the 25th governor of the Reserve Bank of India."
  },
  { 
    id: 9, 
    section: "gk", 
    question: "The headquarters of ISRO is located in:", 
    options: ["Mumbai", "New Delhi", "Bengaluru", "Chennai"],
    correctAnswer: "Bengaluru",
    explanation: "The headquarters of Indian Space Research Organisation is in Bengaluru."
  },
];
