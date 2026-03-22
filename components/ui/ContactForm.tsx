'use client'

import {useState} from 'react'
import {Send, CheckCircle, AlertCircle} from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({name: '', email: '', subject: '', message: ''})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setFormData({name: '', email: '', subject: '', message: ''})
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Failed to send message')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface-elevated border border-accent-primary/30 p-12 text-center">
        <CheckCircle className="w-12 h-12 text-accent-primary mx-auto mb-4" />
        <h3 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-3">
          Message Sent
        </h3>
        <p className="text-text-secondary mb-6">
          Thanks for reaching out! I&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-accent-primary hover:text-accent-primary/80 uppercase tracking-wider text-sm font-bold transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-elevated border border-border p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-bold text-text-primary mb-2">
            Name <span className="text-accent-primary">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            className="w-full bg-background border border-border px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-bold text-text-primary mb-2">
            Email <span className="text-accent-primary">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={200}
            value={formData.email}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            className="w-full bg-background border border-border px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-xs uppercase tracking-wider font-bold text-text-primary mb-2">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          maxLength={200}
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
          className="w-full bg-background border border-border px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-bold text-text-primary mb-2">
          Message <span className="text-accent-primary">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
          className="w-full bg-background border border-border px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-colors resize-vertical"
          placeholder="Your message..."
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group w-full bg-accent-primary hover:bg-accent-primary/90 disabled:bg-accent-primary/50 text-black font-bold uppercase tracking-wider py-4 transition-all duration-300 flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
