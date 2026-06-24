"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import marketingService, {
  Campaign,
  MarketingRecipient,
} from "../../services/marketingService";
import {
  CheckSquare,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Send,
  Square,
  Trash2,
  Users,
} from "lucide-react";

type RecipientSourceFilter = "all" | "customers" | "subscribers";

const recipientKey = (recipient: MarketingRecipient) => recipient.email.toLowerCase();

export default function EmailMarketingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [recipients, setRecipients] = useState<MarketingRecipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<MarketingRecipient[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sourceFilter, setSourceFilter] = useState<RecipientSourceFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      fetchRecipients();
      fetchCampaigns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const name = searchParams.get("name") || "Customer";
    if (!email) return;

    const prefilledRecipient: MarketingRecipient = {
      id: email,
      name,
      email,
      source: "manual",
    };

    setSelectedRecipients((current) => {
      if (current.some((recipient) => recipientKey(recipient) === recipientKey(prefilledRecipient))) {
        return current;
      }
      return [...current, prefilledRecipient];
    });
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchRecipients = async () => {
    try {
      setLoadingRecipients(true);
      setError(null);
      const response = await marketingService.getRecipients({ source: sourceFilter });
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch recipients");
      }
      setRecipients(response.data);
    } catch (err) {
      console.error("Fetch recipients error:", err);
      setRecipients([]);
      setError("Failed to fetch recipients");
    } finally {
      setLoadingRecipients(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const response = await marketingService.getCampaigns();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch campaigns");
      }
      setCampaigns(response.data);
    } catch (err) {
      console.error("Fetch campaigns error:", err);
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      fetchRecipients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceFilter]);

  const filteredRecipients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return recipients;
    return recipients.filter(
      (recipient) =>
        recipient.name.toLowerCase().includes(query) ||
        recipient.email.toLowerCase().includes(query)
    );
  }, [recipients, searchQuery]);

  const selectedEmailSet = useMemo(
    () => new Set(selectedRecipients.map((recipient) => recipientKey(recipient))),
    [selectedRecipients]
  );

  const allFilteredSelected =
    filteredRecipients.length > 0 &&
    filteredRecipients.every((recipient) => selectedEmailSet.has(recipientKey(recipient)));

  const toggleRecipient = (recipient: MarketingRecipient) => {
    setSelectedRecipients((current) => {
      const key = recipientKey(recipient);
      if (current.some((item) => recipientKey(item) === key)) {
        return current.filter((item) => recipientKey(item) !== key);
      }
      return [...current, recipient];
    });
  };

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredKeys = new Set(filteredRecipients.map(recipientKey));
      setSelectedRecipients((current) =>
        current.filter((recipient) => !filteredKeys.has(recipientKey(recipient)))
      );
      return;
    }

    setSelectedRecipients((current) => {
      const next = new Map(current.map((recipient) => [recipientKey(recipient), recipient]));
      filteredRecipients.forEach((recipient) => next.set(recipientKey(recipient), recipient));
      return Array.from(next.values());
    });
  };

  const handleSendCampaign = async () => {
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required");
      return;
    }

    if (selectedRecipients.length === 0) {
      setError("Select at least one recipient");
      return;
    }

    const confirmed = window.confirm(
      `Send this campaign to ${selectedRecipients.length} recipient${selectedRecipients.length === 1 ? "" : "s"}?`
    );
    if (!confirmed) return;

    try {
      setSending(true);
      setError(null);
      const response = await marketingService.sendCampaign({
        subject,
        message,
        recipients: selectedRecipients,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to send campaign");
      }

      setSuccess(
        `Campaign sent: ${response.data.sentCount} sent, ${response.data.failedCount} failed`
      );
      setSubject("");
      setMessage("");
      setSelectedRecipients([]);
      fetchCampaigns();
    } catch (err) {
      console.error("Send campaign error:", err);
      setError("Failed to send campaign");
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated || user?.role !== "Admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {error && (
          <div className="fixed top-4 right-4 z-50 rounded-lg bg-red-500 px-6 py-3 text-white shadow-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="fixed top-4 right-4 z-50 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Email Marketing</h1>
            <p className="mt-1 text-sm text-gray-600">
              Send Resend campaigns to selected customers and subscribers.
            </p>
          </div>
          <button
            onClick={() => {
              fetchRecipients();
              fetchCampaigns();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-4">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Users className="h-5 w-5" />
                  Recipients
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedRecipients.length} selected from {recipients.length} available
                </p>
              </div>
              <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2">
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value as RecipientSourceFilter)}
                  className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2A2C22] focus:outline-none focus:ring-2 focus:ring-[#2A2C22]/20"
                >
                  <option value="all">Customers + subscribers</option>
                  <option value="customers">Customers only</option>
                  <option value="subscribers">Subscribers only</option>
                </select>
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search recipients..."
                    className="w-full min-w-0 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#2A2C22] focus:outline-none focus:ring-2 focus:ring-[#2A2C22]/20"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <button
                onClick={toggleAllFiltered}
                disabled={filteredRecipients.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2A2C22] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a1c12] disabled:opacity-50"
              >
                {allFilteredSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                {allFilteredSelected ? "Unselect visible" : "Select visible"}
              </button>
              <button
                onClick={() => setSelectedRecipients([])}
                disabled={selectedRecipients.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear selected
              </button>
            </div>

            <div className="max-h-[520px] overflow-y-auto rounded-lg border border-gray-200">
              {loadingRecipients ? (
                <div className="flex items-center justify-center gap-2 p-10 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading recipients...
                </div>
              ) : filteredRecipients.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-500">No recipients found.</div>
              ) : (
                filteredRecipients.map((recipient) => {
                  const isSelected = selectedEmailSet.has(recipientKey(recipient));
                  return (
                    <button
                      key={`${recipient.source}-${recipient.email}`}
                      onClick={() => toggleRecipient(recipient)}
                      className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-5 w-5 text-[#2A2C22]" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{recipient.name}</p>
                        <p className="truncate text-xs text-gray-500">{recipient.email}</p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize text-gray-600">
                        {recipient.source}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Mail className="h-5 w-5" />
                Compose Campaign
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Subject</label>
                  <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Fresh treats from Cozy Oven"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#2A2C22] focus:outline-none focus:ring-2 focus:ring-[#2A2C22]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={9}
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#2A2C22] focus:outline-none focus:ring-2 focus:ring-[#2A2C22]/20"
                  />
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                  Sending to <span className="font-bold">{selectedRecipients.length}</span> recipient
                  {selectedRecipients.length === 1 ? "" : "s"}.
                </div>
                <button
                  onClick={handleSendCampaign}
                  disabled={sending || selectedRecipients.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2A2C22] px-4 py-3 font-semibold text-white hover:bg-[#1a1c12] disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  {sending ? "Sending..." : "Send Campaign"}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Campaign History</h2>
              {loadingCampaigns ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading campaigns...
                </div>
              ) : campaigns.length === 0 ? (
                <p className="text-sm text-gray-500">No campaigns sent yet.</p>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div key={campaign._id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">{campaign.subject}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(campaign.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize text-gray-700">
                          {campaign.status}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded bg-gray-50 p-2">
                          <p className="font-bold text-gray-900">{campaign.recipientCount ?? campaign.recipients?.length ?? 0}</p>
                          <p className="text-gray-500">Recipients</p>
                        </div>
                        <div className="rounded bg-green-50 p-2">
                          <p className="font-bold text-green-700">{campaign.sentCount}</p>
                          <p className="text-green-700">Sent</p>
                        </div>
                        <div className="rounded bg-red-50 p-2">
                          <p className="font-bold text-red-700">{campaign.failedCount}</p>
                          <p className="text-red-700">Failed</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
