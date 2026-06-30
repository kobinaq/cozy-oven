"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import faqService, { Faq, FaqInput } from "../../services/faqService";

const emptyForm: FaqInput = {
  question: "",
  answer: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [form, setForm] = useState<FaqInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const response = await faqService.getAdminFaqs();
      setFaqs(response?.data || []);
      setError("");
    } catch (err) {
      console.error("Error loading FAQs:", err);
      setError("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await faqService.updateFaq(editingId, form);
      } else {
        await faqService.createFaq(form);
      }
      resetForm();
      await loadFaqs();
    } catch (err) {
      console.error("Error saving FAQ:", err);
      setError("Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      sortOrder: faq.sortOrder || 0,
    });
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await faqService.deleteFaq(id);
      await loadFaqs();
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      setError("Failed to delete FAQ.");
    }
  };

  const handleToggle = async (faq: Faq) => {
    try {
      await faqService.updateFaq(faq.id, {
        question: faq.question,
        answer: faq.answer,
        isActive: !faq.isActive,
        sortOrder: faq.sortOrder || 0,
      });
      await loadFaqs();
    } catch (err) {
      console.error("Error updating FAQ:", err);
      setError("Failed to update FAQ.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
          <p className="mt-1 text-gray-600">Manage the questions shown on the customer homepage.</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit FAQ" : "Add FAQ"}
            </h2>
            {editingId ? (
              <button type="button" onClick={resetForm} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <X className="h-4 w-4" />
                Cancel edit
              </button>
            ) : (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Plus className="h-4 w-4" />
                New homepage question
              </span>
            )}
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Question
              <input
                value={form.question}
                onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2A2C22]"
                placeholder="When do you deliver?"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Answer
              <textarea
                value={form.answer}
                onChange={(event) => setForm((prev) => ({ ...prev, answer: event.target.value }))}
                rows={4}
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2A2C22]"
                placeholder="Fresh banana bread is delivered on Tuesdays and Thursdays..."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-end">
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Sort order
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))}
                  className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2A2C22]"
                />
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                  className="h-4 w-4"
                />
                Show this FAQ on the website
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 flex items-center gap-2 rounded-lg bg-[#2A2C22] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : editingId ? "Save changes" : "Add FAQ"}
          </button>
        </form>

        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Current FAQs</h2>
          {loading ? (
            <p className="text-gray-500">Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p className="text-gray-500">No FAQs yet. Add your first one above.</p>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq) => (
                <article key={faq.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                          Order {faq.sortOrder || 0}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          faq.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {faq.isActive ? "Visible" : "Hidden"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">{faq.answer}</p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(faq)}
                        className="rounded-lg border px-3 py-2 text-sm"
                      >
                        {faq.isActive ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(faq)}
                        className="rounded-lg border px-3 py-2 text-sm"
                        aria-label="Edit FAQ"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(faq.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
                        aria-label="Delete FAQ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
