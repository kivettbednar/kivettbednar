'use client'

import {Calendar, Share2, Check} from 'lucide-react'
import {useState} from 'react'

interface EventActionsProps {
  title: string
  eventUrl: string
  venue: string
  startDate: string
  endDate: string
  description: string
  location: string
  timezone?: string
}

/** Escape special characters for ICS text fields (commas, semicolons, backslashes, newlines) */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/** Format a date string as ICS local time for a given IANA timezone: YYYYMMDDTHHmmss */
function formatIcsDateTime(dateStr: string, tz: string): string {
  try {
    const date = new Date(dateStr)
    // Use Intl to get the local date/time parts in the target timezone
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(date)

    const get = (type: string) => parts.find((p) => p.type === type)?.value || '00'
    return `${get('year')}${get('month')}${get('day')}T${get('hour')}${get('minute')}${get('second')}`
  } catch {
    // Fallback: UTC format
    return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
}

export function EventActions({
  title,
  eventUrl,
  venue,
  startDate,
  endDate,
  description,
  location,
  timezone = 'America/Los_Angeles',
}: EventActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Event',
          text: `Check out ${title || 'this event'} at ${venue || 'venue'}`,
          url: eventUrl,
        })
      } catch (err) {
        // User canceled share
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddToCalendar = () => {
    const eventTitle = escapeIcsText(title || 'Event')
    const eventLocation = escapeIcsText(location || venue || 'TBD')
    const eventDescription = escapeIcsText(description || title || 'Event')

    const dtStart = formatIcsDateTime(startDate, timezone)
    const dtEnd = formatIcsDateTime(endDate, timezone)
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kivett Bednar//Events//EN
BEGIN:VTIMEZONE
TZID:${timezone}
END:VTIMEZONE
BEGIN:VEVENT
UID:${(title || 'event').replace(/\s+/g, '-')}-${Date.now()}@kivettbednar.com
DTSTAMP:${dtstamp}
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DESCRIPTION:${eventDescription}
DTSTART;TZID=${timezone}:${dtStart}
DTEND;TZID=${timezone}:${dtEnd}
END:VEVENT
END:VCALENDAR`
    const blob = new Blob([icsContent], {type: 'text/calendar'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(title || 'event').replace(/\s+/g, '-')}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-background hover:bg-accent-primary/10 border border-border hover:border-accent-primary text-text-secondary hover:text-accent-primary rounded transition-all"
        aria-label="Share event"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium uppercase tracking-wide hidden sm:inline text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide hidden sm:inline">Share</span>
          </>
        )}
      </button>
      <button
        onClick={handleAddToCalendar}
        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-background hover:bg-accent-primary/10 border border-border hover:border-accent-primary text-text-secondary hover:text-accent-primary rounded transition-all"
        aria-label="Add to calendar"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wide hidden sm:inline">Calendar</span>
      </button>
    </div>
  )
}
