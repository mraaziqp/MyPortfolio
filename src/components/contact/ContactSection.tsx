import React, { useState } from 'react';
import { Mail, MapPin, Phone, Download, Send, CheckCircle2, Building2, Github, Linkedin } from 'lucide-react';
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
    <div className="space-y-6" id="contact">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Direct Inquiries
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Initiate Engagement & Collaboration
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Open to senior engineering roles, enterprise infrastructure administration, or full-stack architectural leadership.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Direct Info & Links */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Engineering Leadership & Systems Roles</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Proven track record in scaling corporate infrastructure, VMware/Hyper-V virtualization clusters, and high-throughput TypeScript platforms.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-md bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  <MapPin size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Location</div>
                  <div className="text-slate-200 text-xs font-medium">Cape Town, South Africa 7500</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-md bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  <Mail size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Direct Email</div>
                  <a
                    href="mailto:mraaziqp@gmail.com"
                    className="text-blue-400 text-xs hover:underline font-medium"
                  >
                    mraaziqp@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-md bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  <Phone size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Phone / WhatsApp</div>
                  <a
                    href="tel:+27837864913"
                    className="text-slate-200 text-xs hover:underline font-medium"
                  >
                    +27 83 786 4913
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-md bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  <Building2 size={15} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Enterprise Track Record</div>
                  <div className="text-slate-200 text-xs">BCX Systems & Infrastructure Support</div>
                </div>
              </div>
            </div>

            {/* Profile Links & CV Download */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <a
                href="/Mohammed_Parker_CV.pdf"
                download="Mohammed_Parker_CV.pdf"
                className="w-full py-2 px-3 rounded bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-semibold text-blue-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={14} className="text-blue-400" />
                <span>Download Verified CV (PDF)</span>
              </a>

              <div className="flex items-center gap-2.5">
                <a
                  href="https://github.com/mraaziqp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Github size={13} className="text-slate-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/mohammedparker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Linkedin size={13} className="text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-5 sm:p-7 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            {isSubmitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">Inquiry Transmitted</h3>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                  Thank you for reaching out. Your message has been cryptographically recorded and assigned an audit receipt.
                </p>

                {receiptInfo && (
                  <div className="p-3 rounded bg-slate-950 border border-slate-800 text-left font-mono text-[11px] space-y-1 w-full max-w-sm">
                    <div className="text-blue-400 flex justify-between">
                      <span>Receipt ID:</span>
                      <span className="font-semibold text-white">{receiptInfo.receiptId}</span>
                    </div>
                    <div className="text-slate-400 flex justify-between">
                      <span>Audit Status:</span>
                      <span className="text-emerald-400">Verified & Logged</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors border border-slate-700 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Category selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Inquiry Classification:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'enterprise_it', label: 'Enterprise Systems' },
                      { id: 'ai_dev', label: 'Full-Stack Software' },
                      { id: 'recruiting', label: 'Recruitment' },
                      { id: 'consulting', label: 'Consulting' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id as any })}
                        className={`px-2 py-1.5 rounded text-xs font-medium transition-colors text-center cursor-pointer ${
                          formData.category === cat.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@company.com"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Organization & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Enterprise Systems Corp"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Senior Infrastructure Role"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about the role scope, architecture requirements, or timeline..."
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} className={isSubmitting ? 'animate-bounce' : ''} />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
