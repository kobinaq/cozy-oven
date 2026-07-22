import apiClient from "./apiClient";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqInput {
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

const fallbackFaqs: Faq[] = [
  {
    id: "default-1",
    question: "When do you deliver?",
    answer: "Fresh banana bread is delivered on Tuesdays and Thursdays. Delivery details are confirmed during checkout.",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "default-2",
    question: "Can I send it as a gift?",
    answer: "Yes. Package products can be ordered as gift boxes, and you can choose the available package details before adding to cart.",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "default-3",
    question: "Where is Cozy Oven located?",
    answer: "Cozy Oven is located at Tema Community 22, Nhmf Estates.",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "default-4",
    question: "How do I keep it fresh?",
    answer:
      "For plain loafs, store in a cool, dry place for up to 3 days.\nFor all other flavours, refrigerate for up to 7 days for longer freshness.\nTo enjoy later, freeze for up to 3 months.\nWarm for 10–15 seconds in the microwave for that fresh-from-the-oven taste.",
    isActive: true,
    sortOrder: 4,
  },
];

const faqService = {
  async getPublicFaqs() {
    try {
      const response = await apiClient.get("/api/v1/faqs");
      return response.data?.data?.length ? response.data.data as Faq[] : fallbackFaqs;
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      return fallbackFaqs;
    }
  },

  async getAdminFaqs() {
    const response = await apiClient.get("/api/v1/dashboard/faqs");
    return response.data;
  },

  async createFaq(data: FaqInput) {
    const response = await apiClient.post("/api/v1/dashboard/faqs", data);
    return response.data;
  },

  async updateFaq(id: string, data: FaqInput) {
    const response = await apiClient.patch(`/api/v1/dashboard/faqs/${id}`, data);
    return response.data;
  },

  async deleteFaq(id: string) {
    const response = await apiClient.delete(`/api/v1/dashboard/faqs/${id}`);
    return response.data;
  },
};

export default faqService;
