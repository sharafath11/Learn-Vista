import axiosInstance from "./axiosInstance";

export const kmatApi = {
  // Daily Data & Learn Content
  getDailyData: async () => {
    const response = await axiosInstance.get("/api/kmat/daily-data");
    return response.data;
  },

  // Exam
  startExam: async () => {
    const response = await axiosInstance.post("/api/kmat/exam/start", {});
    return response.data;
  },

  submitExam: async (sessionId: string, answers: any[]) => {
    const response = await axiosInstance.post("/api/kmat/exam/submit", { sessionId, answers });
    return response.data;
  },

  getResult: async (sessionId: string) => {
    const response = await axiosInstance.get(`/api/kmat/result/${sessionId}`);
    return response.data;
  },

  // Report
  generateReport: async (dayNumber: number) => {
    const response = await axiosInstance.post("/api/kmat/report", { dayNumber });
    return response.data;
  },

  // History
  getHistory: async () => {
    const response = await axiosInstance.get("/api/kmat/history");
    return response.data;
  },

  // Practice
  submitPractice: async (dayNumber: number, answers: any[]) => {
    const response = await axiosInstance.post("/api/kmat/practice/submit", { dayNumber, answers });
    return response.data;
  }
};
