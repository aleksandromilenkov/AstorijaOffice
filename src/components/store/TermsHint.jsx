'use client'

/**
 * A hand that taps the terms checkbox, shown when everything else in the
 * checkout form is filled in and the checkbox is the only thing left.
 *
 * It fades in after a short CSS delay, so it doesn't flash while the customer
 * is still typing. Render it inside the checkbox's row, which must be
 * `position: relative`. Styles and keyframes live in globals.css (.terms-hint).
 */
export default function TermsHint({ active }) {
  if (!active) return null

  return (
    <span className="terms-hint" aria-hidden="true">
      <span className="terms-hint__ripple" />
      <svg className="terms-hint__hand" viewBox="0 0 24 28" fill="none">
        {/* Pointing hand; the fingertip is at (7, 1) */}
        <path
          d="M7 1C8.1 1 9 1.9 9 3V11C9 10.2 9.9 9.6 11 9.6C12.1 9.6 13 10.4 13 11.5V12C13 11.2 13.8 10.6 14.8 10.6C15.9 10.6 16.8 11.4 16.8 12.5V13C16.8 12.2 17.6 11.6 18.5 11.6C19.5 11.6 20.3 12.4 20.3 13.4V19C20.3 23 17.5 26.2 13.5 26.2H11.6C9.2 26.2 7.6 25.2 6.3 23.6L2.3 18.6C1.6 17.7 1.8 16.5 2.7 15.9C3.5 15.3 4.5 15.5 5 16.2V3C5 1.9 5.9 1 7 1Z"
          fill="#fff"
          stroke="#1d2024"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M9 11V15M13 12V15.4M16.8 13V15.6"
          stroke="#1d2024"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Red cuff, in the brand colour */}
        <path d="M8.2 24.6C9.3 25.6 10.5 26.2 11.6 26.2H13.5C15.3 26.2 16.9 25.5 18 24.4" stroke="#d71f2b" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
