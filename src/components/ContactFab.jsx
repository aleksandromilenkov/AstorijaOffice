'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import { company } from '@/content'

// Viber's own glyph (simplified) so the button is instantly recognisable.
function ViberIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.4 1.5C8.1 1.5 3.3 2.2 2.4 7.4c-.5 2.6-.4 5.6.4 7.9.6 1.6 1.5 2.7 3.1 3.3v3.3c0 .5.6.8 1 .4l2.8-3c.6 0 1.2.1 1.8.1 3.3 0 8-.7 8.9-5.9.5-2.6.4-5.6-.4-7.9C18.9 2.2 14.7 1.5 11.4 1.5zm4.3 13.4c-.4.6-1 1-1.6.9-2.1-.4-4.6-2.3-5.9-4.6-.5-.9-.7-1.6-.4-2.3.2-.5.8-1 1.3-1 .3 0 .5.2.7.5l.9 1.4c.2.4.1.8-.2 1.1l-.4.3c.3 1.2 1.4 2.3 2.6 2.7l.3-.4c.3-.3.7-.4 1.1-.2l1.4.8c.4.2.4.6.3.8z" />
    </svg>
  )
}

const HIDDEN_ON = ['/admin', '/kosnicka']

/**
 * Floating "contact us" button: opens Call + Viber shortcuts.
 * Hidden in the admin panel and on the cart page (it would cover "Купи").
 */
export default function ContactFab() {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = useState(false)
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null

  const actions = [
    {
      label: `Јави се: ${company.phones[0].text}`,
      href: company.phones[0].href,
      icon: <PhoneRoundedIcon />,
      bg: '#1f9d55',
    },
    {
      label: 'Пишете ни на Viber',
      href: `viber://chat?number=${encodeURIComponent(company.viber)}`,
      icon: <ViberIcon />,
      bg: '#7360f2',
    },
  ]

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 24 },
        bottom: { xs: 16, md: 24 },
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.25,
      }}
    >
      {actions.map((action, i) => (
        <Zoom
          key={action.href}
          in={open}
          style={{ transitionDelay: open ? `${(actions.length - i) * 40}ms` : '0ms' }}
          unmountOnExit
        >
          <Tooltip title={action.label} placement="left" arrow>
            <Fab
              component="a"
              href={action.href}
              size="medium"
              aria-label={action.label}
              sx={{ bgcolor: action.bg, color: '#fff', '&:hover': { bgcolor: action.bg, filter: 'brightness(1.1)' } }}
            >
              {action.icon}
            </Fab>
          </Tooltip>
        </Zoom>
      ))}
      <Fab
        aria-label={open ? 'Затвори контакт' : 'Контактирајте нè'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        sx={{
          color: '#fff',
          '&::before': open
            ? {}
            : {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                bgcolor: '#d71f2b',
                zIndex: -1,
                animation: 'a-pulse-ring 2.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s infinite',
              },
          '& svg': { transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' },
          '&[aria-expanded="true"] svg': { transform: 'rotate(90deg)' },
          backgroundImage: 'linear-gradient(135deg, #d71f2b, #b3121d)',
          boxShadow: '0 10px 28px -8px rgba(215,31,43,0.7)',
        }}
      >
        {open ? <CloseRoundedIcon /> : <ChatRoundedIcon />}
      </Fab>
    </Box>
  )
}
