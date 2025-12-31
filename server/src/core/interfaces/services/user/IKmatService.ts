export interface IKmatService {
  getDailyData(userId: string): Promise<any>;
  startExam(userId: string, dayNumber: number): Promise<any>;
  submitExam(userId: string, dayNumber: number, sessionId: string, answers: any[]): Promise<any>;
  checkAnswer(sessionId: string, questionId: string, userAnswerIndex: number | null): Promise<any>;
  generateDailyReport(userId: string, dayNumber: number): Promise<any>;
  handleFailedGenerations(): Promise<void>;
  initializeUserKmat(userId: string): Promise<any>;
}
