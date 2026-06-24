import apiClient from "./apiClient";

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  submitMessage: async (payload: ContactMessagePayload) => {
    const response = await apiClient.post("/api/v1/contact", payload);
    return response.data;
  },
};

export default contactService;
