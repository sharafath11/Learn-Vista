import axiosInstance from "./axiosInstance";

export const kmatApi = {
  // Learn
  getLearnContent: async (section: string, topic: string) => {
    const response = await axiosInstance.post("/api/kmat/learn", { section, topic });
    return response.data;
  },

  // Practice
  getPracticeQuestions: async (section: string, topic: string, difficulty: string) => {
    const response = await axiosInstance.post("/api/kmat/practice", { section, topic, difficulty });
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
  }
};
