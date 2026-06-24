import apiClient from "./apiClient";

export type MarketingRecipientSource = "customer" | "subscriber" | "manual";

export interface MarketingRecipient {
  id?: string;
  sourceId?: string;
  name: string;
  email: string;
  source: MarketingRecipientSource;
}

export interface CampaignRecipient extends MarketingRecipient {
  status?: "pending" | "sent" | "failed";
  error?: string;
  sentAt?: string;
}

export interface Campaign {
  _id: string;
  subject: string;
  message?: string;
  status: "draft" | "sending" | "sent" | "failed";
  recipientCount?: number;
  recipients?: CampaignRecipient[];
  sentCount: number;
  failedCount: number;
  sentAt?: string;
  createdAt: string;
}

export const marketingService = {
  getRecipients: async (params?: { source?: "all" | "customers" | "subscribers"; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.source) queryParams.set("source", params.source);
    if (params?.search) queryParams.set("search", params.search);

    const response = await apiClient.get(
      `/api/v1/dashboard/marketing/recipients${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    return response.data as { success: boolean; count: number; data: MarketingRecipient[]; message?: string };
  },

  sendCampaign: async (payload: {
    subject: string;
    message: string;
    recipients: MarketingRecipient[];
  }) => {
    const response = await apiClient.post("/api/v1/dashboard/marketing/campaigns", payload);
    return response.data as { success: boolean; message: string; data: Campaign };
  },

  getCampaigns: async () => {
    const response = await apiClient.get("/api/v1/dashboard/marketing/campaigns");
    return response.data as { success: boolean; data: Campaign[]; message?: string };
  },
};

export default marketingService;
