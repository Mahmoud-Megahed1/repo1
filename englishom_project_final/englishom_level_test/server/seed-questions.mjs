import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const questions = [
  // Stage 1: Vocabulary (10 questions)
  {
    stage: 1,
    questionText: "What is the English word for 'كتاب'?",
    options: ["Book", "Pen", "Paper", "Desk"],
    correctAnswer: "Book",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "Which word means 'سيارة' in English?",
    options: ["Car", "Bus", "Train", "Bike"],
    correctAnswer: "Car",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "What is 'منزل' in English?",
    options: ["House", "School", "Hospital", "Office"],
    correctAnswer: "House",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "Which word means 'طعام'?",
    options: ["Food", "Water", "Drink", "Juice"],
    correctAnswer: "Food",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "What is 'شمس' in English?",
    options: ["Sun", "Moon", "Star", "Cloud"],
    correctAnswer: "Sun",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "Which word means 'ماء'?",
    options: ["Water", "Milk", "Tea", "Coffee"],
    correctAnswer: "Water",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "What is 'حيوان' in English?",
    options: ["Animal", "Bird", "Fish", "Insect"],
    correctAnswer: "Animal",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "Which word means 'لون'?",
    options: ["Color", "Shape", "Size", "Form"],
    correctAnswer: "Color",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "What is 'رقم' in English?",
    options: ["Number", "Letter", "Word", "Symbol"],
    correctAnswer: "Number",
    difficulty: "easy"
  },
  {
    stage: 1,
    questionText: "Which word means 'وقت'?",
    options: ["Time", "Hour", "Minute", "Second"],
    correctAnswer: "Time",
    difficulty: "easy"
  },

  // Stage 2: Grammar (10 questions)
  {
    stage: 2,
    questionText: "Complete: 'She ___ to the market yesterday.'",
    options: ["goes", "went", "going", "go"],
    correctAnswer: "went",
    difficulty: "easy"
  },
  {
    stage: 2,
    questionText: "Which sentence is correct?",
    options: ["He don't like apples", "He doesn't like apples", "He no like apples", "He not likes apples"],
    correctAnswer: "He doesn't like apples",
    difficulty: "easy"
  },
  {
    stage: 2,
    questionText: "Fill in: 'I ___ been to Paris three times.'",
    options: ["have", "has", "had", "having"],
    correctAnswer: "have",
    difficulty: "medium"
  },
  {
    stage: 2,
    questionText: "Choose the correct form: 'If I ___ you, I would help.'",
    options: ["was", "were", "am", "being"],
    correctAnswer: "were",
    difficulty: "medium"
  },
  {
    stage: 2,
    questionText: "Complete: 'They ___ playing football when it started to rain.'",
    options: ["were", "are", "was", "is"],
    correctAnswer: "were",
    difficulty: "medium"
  },
  {
    stage: 2,
    questionText: "Which is grammatically correct?",
    options: ["She asked me what I was doing", "She asked me what was I doing", "She asked me what I doing", "She asked me what am I doing"],
    correctAnswer: "She asked me what I was doing",
    difficulty: "medium"
  },
  {
    stage: 2,
    questionText: "Fill in: 'By next year, I ___ here for five years.'",
    options: ["will have worked", "will work", "have worked", "work"],
    correctAnswer: "will have worked",
    difficulty: "hard"
  },
  {
    stage: 2,
    questionText: "Choose: 'The book ___ by my favorite author.'",
    options: ["written", "was written", "is written", "has written"],
    correctAnswer: "was written",
    difficulty: "medium"
  },
  {
    stage: 2,
    questionText: "Complete: 'I wish I ___ more time to study.'",
    options: ["have", "had", "has", "having"],
    correctAnswer: "had",
    difficulty: "medium"
  },
  {
    stage: 2,
    questionText: "Which sentence has correct subject-verb agreement?",
    options: ["The team are winning", "The team is winning", "The team were winning", "The team has winning"],
    correctAnswer: "The team is winning",
    difficulty: "medium"
  },

  // Stage 3: Reading (10 questions)
  {
    stage: 3,
    questionText: "Read: 'The ancient library of Alexandria was one of the greatest centers of learning in the ancient world. It contained hundreds of thousands of scrolls and manuscripts.' - What was the library known for?",
    options: ["Military strength", "Learning and knowledge", "Trade routes", "Religious ceremonies"],
    correctAnswer: "Learning and knowledge",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'Climate change is causing glaciers to melt at an unprecedented rate. This is leading to rising sea levels and threatening coastal communities.' - What is the main cause of glacier melting?",
    options: ["Pollution", "Climate change", "Earthquakes", "Human construction"],
    correctAnswer: "Climate change",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'Photosynthesis is the process by which plants convert sunlight into chemical energy. This process is essential for life on Earth.' - Why is photosynthesis important?",
    options: ["It creates pollution", "It is essential for life on Earth", "It causes climate change", "It reduces oxygen"],
    correctAnswer: "It is essential for life on Earth",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'The Industrial Revolution transformed society by introducing mechanized production. This led to rapid urbanization and social changes.' - What was a result of the Industrial Revolution?",
    options: ["Decreased production", "Decreased urbanization", "Rapid urbanization and social changes", "Return to agriculture"],
    correctAnswer: "Rapid urbanization and social changes",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'Artificial Intelligence is revolutionizing various industries from healthcare to transportation. However, it also raises important ethical questions.' - What concern is mentioned about AI?",
    options: ["It's too slow", "Ethical questions", "It's too expensive", "It's not useful"],
    correctAnswer: "Ethical questions",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'The Great Wall of China was built over many centuries to protect against invasions. It stretches over 13,000 miles.' - What was the primary purpose of the Great Wall?",
    options: ["Trade", "Protection against invasions", "Tourism", "Religious purposes"],
    correctAnswer: "Protection against invasions",
    difficulty: "easy"
  },
  {
    stage: 3,
    questionText: "Read: 'Renewable energy sources like solar and wind power are becoming increasingly important as we seek to reduce carbon emissions.' - Why are renewable energy sources important?",
    options: ["They are expensive", "To reduce carbon emissions", "They are unreliable", "They cause pollution"],
    correctAnswer: "To reduce carbon emissions",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'The human brain contains approximately 86 billion neurons. These neurons communicate through electrical and chemical signals.' - What do neurons use to communicate?",
    options: ["Sound waves", "Light signals", "Electrical and chemical signals", "Mechanical vibrations"],
    correctAnswer: "Electrical and chemical signals",
    difficulty: "medium"
  },
  {
    stage: 3,
    questionText: "Read: 'Shakespeare wrote 37 plays and 154 sonnets during his lifetime. His works have been translated into every major language.' - How many plays did Shakespeare write?",
    options: ["27", "37", "47", "57"],
    correctAnswer: "37",
    difficulty: "easy"
  },
  {
    stage: 3,
    questionText: "Read: 'The Amazon rainforest produces about 20% of the world's oxygen and is home to millions of species. Deforestation threatens this vital ecosystem.' - What is threatened by deforestation?",
    options: ["Ocean life", "The Amazon ecosystem", "Desert life", "Arctic animals"],
    correctAnswer: "The Amazon ecosystem",
    difficulty: "medium"
  },

  // Stage 4: Listening (10 questions)
  {
    stage: 4,
    questionText: "Listen to: 'Good morning, I would like to book a table for two at 7 PM tonight.' - What does the speaker want to do?",
    options: ["Order food", "Book a table", "Make a reservation", "Cancel a booking"],
    correctAnswer: "Book a table",
    difficulty: "easy"
  },
  {
    stage: 4,
    questionText: "Listen to: 'The weather forecast predicts heavy rain tomorrow with temperatures around 15 degrees Celsius.' - What is the temperature forecast?",
    options: ["25 degrees", "15 degrees", "5 degrees", "35 degrees"],
    correctAnswer: "15 degrees",
    difficulty: "easy"
  },
  {
    stage: 4,
    questionText: "Listen to: 'I have been working at this company for ten years and I really enjoy my job.' - How long has the speaker worked there?",
    options: ["5 years", "10 years", "15 years", "20 years"],
    correctAnswer: "10 years",
    difficulty: "easy"
  },
  {
    stage: 4,
    questionText: "Listen to: 'The flight to London has been delayed by two hours due to technical issues.' - Why is the flight delayed?",
    options: ["Weather", "Technical issues", "Passenger delay", "Maintenance"],
    correctAnswer: "Technical issues",
    difficulty: "easy"
  },
  {
    stage: 4,
    questionText: "Listen to: 'I would recommend taking the 9 AM train as it is faster and more comfortable than the bus.' - What is being recommended?",
    options: ["The bus", "The 9 AM train", "The car", "Walking"],
    correctAnswer: "The 9 AM train",
    difficulty: "easy"
  },
  {
    stage: 4,
    questionText: "Listen to: 'The conference will be held in the main hall on the third floor next Monday.' - Where will the conference be held?",
    options: ["Second floor", "Main hall on the third floor", "Basement", "Outside"],
    correctAnswer: "Main hall on the third floor",
    difficulty: "medium"
  },
  {
    stage: 4,
    questionText: "Listen to: 'I am sorry, but we are currently out of stock for that item. We expect new supplies next week.' - When will new supplies arrive?",
    options: ["Today", "Tomorrow", "Next week", "Next month"],
    correctAnswer: "Next week",
    difficulty: "medium"
  },
  {
    stage: 4,
    questionText: "Listen to: 'The museum is open from 9 AM to 6 PM on weekdays and 10 AM to 8 PM on weekends.' - What are the weekend hours?",
    options: ["9 AM to 6 PM", "10 AM to 8 PM", "8 AM to 5 PM", "11 AM to 7 PM"],
    correctAnswer: "10 AM to 8 PM",
    difficulty: "medium"
  },
  {
    stage: 4,
    questionText: "Listen to: 'The project deadline has been moved from March to April due to unforeseen circumstances.' - When is the new deadline?",
    options: ["February", "March", "April", "May"],
    correctAnswer: "April",
    difficulty: "medium"
  },
  {
    stage: 4,
    questionText: "Listen to: 'I cannot attend the meeting tomorrow because I have a doctor's appointment.' - Why cannot the speaker attend?",
    options: ["Work conflict", "Doctor's appointment", "Travel plans", "Family event"],
    correctAnswer: "Doctor's appointment",
    difficulty: "easy"
  },

  // Stage 5: Writing (10 questions)
  {
    stage: 5,
    questionText: "Write a sentence: 'I enjoy ___ in the morning.' (Use the correct gerund form)",
    options: ["run", "running", "runs", "ran"],
    correctAnswer: "running",
    difficulty: "easy"
  },
  {
    stage: 5,
    questionText: "Complete: 'Although it was raining, ___' (Choose the logical continuation)",
    options: ["we stayed inside", "we went to the beach", "we fell asleep", "we watched TV"],
    correctAnswer: "we went to the beach",
    difficulty: "medium"
  },
  {
    stage: 5,
    questionText: "Write: 'If I had known about the party, I ___ attended.' (Choose correct form)",
    options: ["would have", "would", "will have", "have"],
    correctAnswer: "would have",
    difficulty: "hard"
  },
  {
    stage: 5,
    questionText: "Complete the sentence: 'The book, ___ I bought last week, is very interesting.'",
    options: ["which", "that", "who", "where"],
    correctAnswer: "which",
    difficulty: "medium"
  },
  {
    stage: 5,
    questionText: "Write a formal email opening: Which is most appropriate?",
    options: ["Hey buddy", "Dear Sir or Madam", "Yo", "What's up"],
    correctAnswer: "Dear Sir or Madam",
    difficulty: "easy"
  },
  {
    stage: 5,
    questionText: "Complete: 'Not only did she pass the exam, but she also ___'",
    options: ["failed", "scored the highest", "was absent", "withdrew"],
    correctAnswer: "scored the highest",
    difficulty: "hard"
  },
  {
    stage: 5,
    questionText: "Write: 'The CEO ___ the company's new strategy at the conference.'",
    options: ["announced", "announceing", "announces", "announce"],
    correctAnswer: "announced",
    difficulty: "easy"
  },
  {
    stage: 5,
    questionText: "Which sentence is written in active voice?",
    options: ["The cake was eaten by the children", "The children ate the cake", "The cake was being eaten", "The cake had been eaten"],
    correctAnswer: "The children ate the cake",
    difficulty: "medium"
  },
  {
    stage: 5,
    questionText: "Complete: 'I would appreciate it if you ___ send me the report by Friday.'",
    options: ["will", "would", "could", "can"],
    correctAnswer: "could",
    difficulty: "hard"
  },
  {
    stage: 5,
    questionText: "Write a conclusion: Which is most appropriate for a formal essay?",
    options: ["In conclusion, I think...", "So like, that's it", "Anyway...", "Whatever..."],
    correctAnswer: "In conclusion, I think...",
    difficulty: "easy"
  }
];

async function seedQuestions() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'englishom_level_test',
  });

  try {
    console.log('Seeding questions...');
    
    for (const question of questions) {
      const optionsJson = JSON.stringify(question.options);
      const query = `
        INSERT INTO questions (stage, questionText, options, correctAnswer, difficulty, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await connection.execute(query, [
        question.stage,
        question.questionText,
        optionsJson,
        question.correctAnswer,
        question.difficulty
      ]);
    }
    
    console.log(`✅ Successfully seeded ${questions.length} questions!`);
  } catch (error) {
    console.error('Error seeding questions:', error);
  } finally {
    await connection.end();
  }
}

seedQuestions();
