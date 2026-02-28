import axiosInstance from "./axiosInstance";

const normalize = (payload: any) => ({
  success: !!payload?.ok,
  message: payload?.msg || "",
  data: payload?.data
});

export const kmatApi = {
  // Daily Data & Learn Content
  getDailyData: async () => {
    const response = await axiosInstance.get("/api/kmat/daily-data");
    return normalize(response.data);
  },

  // Exam
  startExam: async (dayNumber?: number) => {
    const response = await axiosInstance.post("/api/kmat/exam/start", { dayNumber });
    return normalize(response.data);
  },

  submitExam: async (sessionId: string, answers: any[], dayNumber?: number) => {
    const response = await axiosInstance.post("/api/kmat/exam/submit", { sessionId, answers, dayNumber });
    return normalize(response.data);
  },

  getResult: async (sessionId: string) => {
    const response = await axiosInstance.get(`/api/kmat/result/${sessionId}`);
    return normalize(response.data);
  },

  // Report
  generateReport: async (dayNumber: number) => {
    const response = await axiosInstance.post("/api/kmat/report", { dayNumber });
    return normalize(response.data);
  },

  // History
  getHistory: async () => {
    const response = await axiosInstance.get("/api/kmat/history");
    return normalize(response.data);
  },

  // Practice
  submitPractice: async (dayNumber: number, answers: any[]) => {
    const response = await axiosInstance.post("/api/kmat/practice/submit", { dayNumber, answers });
    return normalize(response.data);
  }
};
