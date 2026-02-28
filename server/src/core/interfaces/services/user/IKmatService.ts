export interface IKmatService {
  getDailyData(userId: string): Promise<any>;
  startExam(userId: string, dayNumber?: number): Promise<any>;
  submitExam(userId: string, dayNumber: number | undefined, sessionId: string, answers: any[]): Promise<any>;
  generateDailyReport(userId: string, dayNumber: number): Promise<any>;
  handleFailedGenerations(): Promise<void>;
  initializeUserKmat(userId: string): Promise<any>;
  getHistory(userId: string): Promise<any>;
  submitPractice(userId: string, dayNumber: number, answers: any[]): Promise<any>;
  getResult(userId: string, id: string): Promise<any>;
}
