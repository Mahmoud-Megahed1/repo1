import { connectToDatabase } from '../mongodb';
import { Question, IQuestion } from './Question';

export async function createQuestion(data: Omit<IQuestion, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await connectToDatabase();
    const question = new Question(data);
    const saved = await question.save();
    return saved;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
}

export async function getQuestions(
  stage?: string,
  level?: string
) {
  try {
    await connectToDatabase();
    
    const filter: any = {};
    if (stage && stage !== 'all') filter.stage = stage;
    if (level && level !== 'all') filter.level = level;
    
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function getQuestionById(id: string) {
  try {
    await connectToDatabase();
    const question = await Question.findById(id);
    return question;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
}

export async function updateQuestion(
  id: string,
  data: Partial<Omit<IQuestion, '_id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    await connectToDatabase();
    const question = await Question.findByIdAndUpdate(id, data, { new: true });
    return question;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
}

export async function deleteQuestion(id: string) {
  try {
    await connectToDatabase();
    const result = await Question.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
}

export async function deleteAllQuestions() {
  try {
    await connectToDatabase();
    const result = await Question.deleteMany({});
    return result;
  } catch (error) {
    console.error('Error deleting all questions:', error);
    throw error;
  }
}
