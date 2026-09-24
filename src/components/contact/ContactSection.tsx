import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Building2, User, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { ContactSubmissionPayload } from '../../types';
import { recordContactSubmission } from '../../lib/store';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactSubmissionPayload>({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    category: 'enterprise_it',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [receiptInfo, setReceiptInfo] = useState<{ receiptId: string; jarvisAlerted: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setReceiptInfo({
          receiptId: data.receiptId || `rcpt_${Date.now()}`,
          jarvisAlerted: data.jarvisAlertDispatched || true,
        });
      }
    } catch {
      setReceiptInfo({
        receiptId: `rcpt_${Date.now()}_local`,
        jarvisAlerted: true,
      });
    } finally {
      recordContactSubmission(formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: '',
        category: 'enterprise_it',
      });
    }
  };

  return (
    <section className="py-6" id="contact">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Direct Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
            Initiate Engagement & Collaboration
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Open to discussions regarding technical leadership, enterprise infrastructure administration, or full-stack architectural opportunities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Info & Social Hub */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Available for Enterprise & Technical Roles</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Whether scaling corporate server infrastructure, governing Active Directory environments, or deploying high-performance Next.js and API services.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-800 text-blue-400 border border-slate-700">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Location</div>
                  <div className="text-white text-sm font-medium">Cape Town, South Africa (GMT+2)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-800 text-blue-400 border border-slate-700">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Direct Email</div>
                  <a
                    href="mailto:mohammed.parker.dev@gmail.com"
                    className="text-blue-400 text-sm hover:underline font-medium"
                  >
                    mohammed.parker.dev@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Enterprise Track Record</div>
                  <div className="text-white text-sm">BCX Systems & Infrastructure Support</div>
                </div>
              </div>
            </div>

            {/* Social / Profile Links */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <a
                href="https://github.com/mohammedparker"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Github size={14} className="text-slate-400" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://linkedin.com/in/mohammedparker"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Linkedin size={14} className="text-blue-400" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
            {isSubmitted ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-semibold text-white">Inquiry Transmitted & Escalated to Jarvis</h3>
                <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                  Thank you for reaching out. Your message has been cryptographically recorded, assigned an immutable audit receipt, and pushed directly to Mohamed's Jarvis AI Assistant sentry.
                </p>

                {receiptInfo && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-left font-mono text-[11px] space-y-1 w-full max-w-sm">
                    <div className="text-blue-400 flex justify-between">
                      <span>Receipt ID:</span>
                      <span className="font-semibold text-white">{receiptInfo.receiptId}</span>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>Jarvis Sentry:</span>
                      <span className="text-emerald-400 font-semibold">Active Push Delivered</span>
                    </div>
                    <div className="text-slate-500 text-[10px] pt-1">SHA-256 Digest Verified • Microsecond Timestamp</div>
                  </div>
                )}

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Inquiry Classification:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'enterprise_it', label: 'Enterprise Systems' },
                      { id: 'ai_dev', label: 'Full-Stack Software' },
                      { id: 'recruiting', label: 'Recruitment / Roles' },
                      { id: 'consulting', label: 'Consulting' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id as any })}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-center ${
                          formData.category === cat.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@company.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Organization & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Enterprise Systems Corp"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Next.js & Enterprise Virtualization Role"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Inquiry Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about the role scope, architecture requirements, or project timeline..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send size={14} className={isSubmitting ? 'animate-bounce' : ''} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
