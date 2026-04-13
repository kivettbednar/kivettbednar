'use client'

import {useState, FormEvent} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

interface NewsletterFormProps {
  buttonText?: string
  successText?: string
  placeholder?: string
  disclaimer?: string
}

export function NewsletterForm({
  buttonText = 'Subscribe',
  successText = 'Thanks for joining the list.',
  placeholder = 'your@email.com',
  disclaimer = 'No spam. Unsubscribe anytime.',
}: NewsletterFormProps = {}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })
      const data = await response.json()
      if (response.ok) {
        setStatus('success')
        setMessage(data.message || successText)
      } else {
        setStatus('error')
        setMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again later.')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.p
            key="success"
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
            className="font-display italic text-lg md:text-xl text-accent-primary py-4"
          >
            {message || successText}
          </motion.p>
        ) : (
          <motion.form
            key="form"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onSubmit={handleSubmit}
            className="w-full"
          >
            <div className="flex items-center gap-3 border-b border-white/30 focus-within:border-accent-primary transition-colors duration-300 pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                disabled={status === 'loading'}
                aria-label="Email address"
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-base py-1 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="shrink-0 text-accent-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-200 inline-flex items-center gap-1"
              >
                <span>{status === 'loading' ? '…' : buttonText}</span>
                {status !== 'loading' && <span aria-hidden="true">→</span>}
              </button>
            </div>

            <div className="mt-4 text-xs text-white/50 tracking-wide">
              {status === 'error' && message ? (
                <span className="text-red-400">{message}</span>
              ) : (
                disclaimer
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
