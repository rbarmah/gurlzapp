import { FunFact, SelfCareIdea, SymptomCategory } from '../../../types/health';

export const periodFacts: FunFact[] = [
  { 
    fact: "Your period blood isn't just blood - it's also tissue from your uterine lining, full of nutrients!",
    icon: "🔬"
  },
  { 
    fact: "People who live together often experience menstrual cycle synchronization - it's called the McClintock effect!",
    icon: "👯‍♀️"
  },
  { 
    fact: "During your period, your pain tolerance actually increases - you're literally stronger!",
    icon: "💪"
  },
  {
    fact: "The average person loses only about 2-3 tablespoons of blood during their entire period!",
    icon: "💭"
  },
  {
    fact: "Chocolate cravings during periods are real! Dark chocolate can help with mood and cramps.",
    icon: "🍫"
  }
];

export const selfCareIdeas: SelfCareIdea[] = [
  { text: "Take a warm bath with essential oils", icon: "🛁" },
  { text: "Practice gentle yoga or stretching", icon: "🧘‍♀️" },
  { text: "Enjoy a cup of chamomile tea", icon: "🍵" },
  { text: "Use a heating pad on your lower abdomen", icon: "♨️" },
  { text: "Listen to calming music", icon: "🎵" },
  { text: "Take a nap if you need it", icon: "😴" },
  { text: "Eat foods rich in iron", icon: "🥬" },
  { text: "Stay hydrated", icon: "💧" }
];

export const symptoms: SymptomCategory[] = [
  {
    category: "Physical",
    items: [
      "Cramps", "Headache", "Backache", "Breast Tenderness", 
      "Bloating", "Fatigue", "Acne", "Nausea"
    ]
  },
  {
    category: "Emotional",
    items: [
      "Mood Swings", "Anxiety", "Irritability", "Depression",
      "Food Cravings", "Low Energy", "Emotional Sensitivity"
    ]
  },
  {
    category: "Flow",
    items: [
      "Light", "Medium", "Heavy", "Spotting"
    ]
  }
];