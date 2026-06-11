import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const MAIL_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const PHONE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
  </svg>
)
const PIN_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const CLOCK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

function FooterLink({ href, icon, children }) {
  return (
    <Box
      component={href ? 'a' : 'div'}
      href={href}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.2,
        color: 'rgba(255,255,255,0.82)',
        textDecoration: 'none',
        fontSize: '0.83rem',
        lineHeight: 1.6,
        transition: 'color 0.2s',
        '&:hover': { color: '#c77dff' },
      }}
    >
      <Box sx={{ flexShrink: 0, opacity: 0.85 }}>{icon}</Box>
      {children}
    </Box>
  )
}

function FooterCol({ title, children }) {
  return (
    <Box>
      <Typography sx={{
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#862e9c',
        fontWeight: 700,
        mb: 2,
      }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        {children}
      </Box>
    </Box>
  )
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a2e',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        // Top border glow
        borderTop: '1px solid rgba(134,46,156,0.25)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #862e9c, #c77dff, #862e9c, transparent)',
        },
        // Ambient glow
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-30%', left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw', height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,46,156,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Top section: logo + quote */}
        <Box sx={{
          pt: { xs: 6, md: 8 },
          pb: { xs: 5, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          gap: 4,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {/* Logo + tagline */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Box
              component="img"
              src="/img/footer_logo.png"
              alt="Astorija logo"
              sx={{ height: 52, width: 'auto', mb: 2, filter: 'brightness(1.1)' }}
            />
            <Typography sx={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.05em',
              maxWidth: 220,
              textAlign: { xs: 'center', md: 'left' },
              lineHeight: 1.6,
            }}>
              Printing your vision since 1998.
            </Typography>
          </Box>

          {/* Quote */}
          <Box sx={{
            maxWidth: 380,
            textAlign: { xs: 'center', md: 'right' },
          }}>
            <Typography sx={{
              fontSize: { xs: '1rem', md: '1.15rem' },
              fontStyle: 'italic',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.65,
              mb: 0.75,
            }}>
              "Quality means doing it right<br />when no one is looking."
            </Typography>
            <Typography sx={{
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#862e9c',
              fontWeight: 600,
            }}>
              — Henry Ford
            </Typography>
          </Box>
        </Box>

        {/* Middle: 3 columns */}
        <Box sx={{
          py: { xs: 5, md: 6 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
          gap: { xs: 4, md: 6 },
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <FooterCol title="Contact">
            <FooterLink href="tel:+38970210128"  icon={PHONE_ICON}>070-210-128</FooterLink>
            <FooterLink href="tel:+38932444466"  icon={PHONE_ICON}>032-444-466</FooterLink>
            <FooterLink href="mailto:astorijanova@yahoo.com" icon={MAIL_ICON}>astorijanova@yahoo.com</FooterLink>
          </FooterCol>

          <FooterCol title="Working Hours">
            <FooterLink icon={CLOCK_ICON}>Mon – Fri &nbsp; 08:00 – 15:00</FooterLink>
            <FooterLink icon={CLOCK_ICON}>Saturday &nbsp;&nbsp; 08:00 – 14:00</FooterLink>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ opacity: 0.3, flexShrink: 0 }}>{CLOCK_ICON}</Box>
              <Typography sx={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through' }}>
                Sunday
              </Typography>
              <Box sx={{
                px: 1, py: 0.2, borderRadius: 99,
                background: 'rgba(134,46,156,0.2)',
                border: '1px solid rgba(134,46,156,0.3)',
                fontSize: '0.6rem', letterSpacing: '0.1em',
                color: '#ae3ec9', fontWeight: 600,
              }}>
                CLOSED
              </Box>
            </Box>
          </FooterCol>

          <FooterCol title="Location">
            <FooterLink icon={PIN_ICON}>Leninova 24</FooterLink>
            <FooterLink icon={PIN_ICON}>Square Ilinden No.34</FooterLink>
            <FooterLink icon={PIN_ICON}>2220 Sveti Nikole, Macedonia</FooterLink>
          </FooterCol>
        </Box>

        {/* Bottom bar */}
        <Box sx={{
          py: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}>
          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Astorija. All rights reserved.
          </Typography>

          {/* Purple dot divider decoration */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {[1,2,3].map(i => (
              <Box key={i} sx={{
                width: i === 2 ? 16 : 4,
                height: 4,
                borderRadius: 99,
                background: i === 2 ? 'linear-gradient(90deg,#862e9c,#c77dff)' : 'rgba(134,46,156,0.3)',
              }} />
            ))}
          </Box>

          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>
            Sveti Nikole, Macedonia
          </Typography>
        </Box>

      </Container>
    </Box>
  )
}