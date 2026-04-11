'use client'

import {useState, FormEvent} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Mail, Check, AlertCircle, Loader2} from 'lucide-react'

interface NewsletterFormProps {
  buttonText?: string
  successText?: string
  placeholder?: string
  disclaimer?: string
}

export function NewsletterForm({
  buttonText = 'Join the List',
  successText = 'Subscribed',
  placeholder = 'Enter your email',
  disclaimer = 'We respect your privacy. Unsubscribe at any time.',
}: NewsletterFormProps = {}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again later.')
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <div className={`relative flex flex-col sm:flex-row gap-3 p-1.5 bg-surface border transition-all duration-300 ${
          isFocused
            ? 'border-accent-primary shadow-lg shadow-accent-primary/10'
            : 'border-border'
        }`}>
          {/* Email input with icon */}
          <div className="relative flex-1">
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
              isFocused ? 'text-accent-primary' : 'text-text-muted'
            }`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              required
              disabled={status === 'loading' || status === 'success'}
              className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder:text-text-muted focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            whileHover={{scale: status === 'loading' ? 1 : 1.02}}
            whileTap={{scale: status === 'loading' ? 1 : 0.98}}
            className="relative px-8 py-4 bg-accent-primary text-black font-bold uppercase tracking-wider text-sm overflow-hidden disabled:cursor-not-allowed group"
          >
            <span className={`inline-flex items-center gap-2 transition-opacity ${
              status === 'loading' ? 'opacity-0' : 'opacity-100'
            }`}>
              {status === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  {successText}
                </>
              ) : (
                buttonText
              )}
            </span>

            {status === 'loading' && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </span>
            )}

            {/* Hover sweep effect */}
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
          </motion.button>
        </div>

        {/* Subtle accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-accent-primary"
          initial={{width: 0}}
          animate={{width: isFocused ? '100%' : 0}}
          transition={{duration: 0.3}}
        />
      </form>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className={`mt-4 text-center flex items-center justify-center gap-2 ${
              status === 'success' ? 'text-accent-primary' : 'text-red-400'
            }`}
          >
            {status === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-text-muted mt-4 text-center">
        {disclaimer}
      </p>
    </div>
  )
}
