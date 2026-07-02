import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useTranslations } from '../translations'

function useReveal(delay = 0) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible, delay]
}

function RevealBox({ children, delay = 0, sx = {} }) {
  const [ref, visible] = useReveal()
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

const PIN_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const CLOCK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const MAIL_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const PHONE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
  </svg>
)

function InfoRow({ icon, children, href }) {
  const content = (
    <Box sx={{
      display: 'flex', alignItems: 'flex-start', gap: 1.5,
      color: href ? 'inherit' : 'text.secondary',
      textDecoration: 'none',
      '&:hover span': href ? { color: '#c77dff' } : {},
    }}
    component={href ? 'a' : 'div'}
    href={href}
    >
      <Box sx={{ color: '#862e9c', mt: '2px', flexShrink: 0 }}>{icon}</Box>
      <Typography component="span" sx={{
        fontSize: '0.88rem', lineHeight: 1.6,
        color: 'text.secondary',
        transition: 'color 0.2s',
      }}>
        {children}
      </Typography>
    </Box>
  )
  return content
}

export default function About() {
  const { t } = useTranslations()
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 7, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-10%', left: '-5%',
          width: '40vw', height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,46,156,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">

        {/* Header */}
        <RevealBox sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography sx={{
            fontSize: '0.65rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'primary.main',
            fontWeight: 700, mb: 1.5, display: 'block',
          }}>
            {t.about.overline}
          </Typography>
          <Typography sx={{
            fontSize: { xs: '2rem', md: '2.8rem' },
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            {t.about.title.split(' ')[0]}{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #862e9c, #c77dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t.about.title.split(' ').slice(1).join(' ')}
            </Box>
          </Typography>
        </RevealBox>

        {/* Main layout */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 3, md: 4 },
          alignItems: 'start',
        }}>

          {/* LEFT — Story card */}
          <RevealBox delay={100}>
            <Box sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: '1px solid rgba(134,46,156,0.15)',
              background: 'rgba(134,46,156,0.04)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #862e9c, #c77dff)',
              },
            }}>
              {/* Big quote mark */}
              <Typography sx={{
                fontSize: '6rem', lineHeight: 0.6,
                color: 'rgba(134,46,156,0.15)',
                fontWeight: 900, mb: 2, display: 'block',
                userSelect: 'none',
              }}>
                "
              </Typography>

              <Typography sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.8,
                color: 'text.secondary',
                mb: 3,
              }}>
                {t.about.story}
              </Typography>

              {/* Timeline strip */}
              <Box sx={{ display: 'flex', gap: 0, mt: 2 }}>
                {t.about.timeline.map((item, i, arr) => (
                  <Box key={item.year} sx={{ flex: 1, position: 'relative' }}>
                    {/* connector line */}
                    {i < arr.length - 1 && (
                      <Box sx={{
                        position: 'absolute',
                        top: 7, left: '50%', right: '-50%',
                        height: '1px',
                        background: 'rgba(134,46,156,0.25)',
                        zIndex: 0,
                      }} />
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                      <Box sx={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: i === arr.length - 1 ? '#862e9c' : 'rgba(134,46,156,0.3)',
                        border: '2px solid',
                        borderColor: '#862e9c',
                        mb: 0.75,
                      }} />
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: i === arr.length - 1 ? 'primary.main' : 'text.primary' }}>
                        {item.year}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', textAlign: 'center' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </RevealBox>

          {/* RIGHT — two stacked cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>

            {/* Location card */}
            <RevealBox delay={200}>
              <Box sx={{
                borderRadius: 3,
                border: '1px solid rgba(134,46,156,0.15)',
                background: 'rgba(134,46,156,0.04)',
                overflow: 'hidden',
                transition: 'border-color 0.3s',
                '&:hover': { borderColor: 'rgba(134,46,156,0.4)' },
              }}>
                {/* Map embed */}
                <Box sx={{ width: '100%', height: 180, overflow: 'hidden' }}>
                  <iframe
                    title="Astorija location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=21.90%2C41.85%2C21.98%2C41.91&layer=mapnik&marker=41.877%2C21.939"
                    width="100%"
                    height="180"
                    style={{ border: 0, display: 'block', filter: 'hue-rotate(260deg) saturate(0.6) brightness(0.85)' }}
                    loading="lazy"
                  />
                </Box>
                <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                  <InfoRow icon={PIN_ICON}>
                    Square Ilinden No.34, Sveti Nikole, Macedonia
                  </InfoRow>
                </Box>
              </Box>
            </RevealBox>

            {/* Contact card */}
            <RevealBox delay={300}>
              <Box sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid rgba(134,46,156,0.15)',
                background: 'rgba(134,46,156,0.04)',
                display: 'flex', flexDirection: 'column', gap: 2,
                transition: 'border-color 0.3s',
                '&:hover': { borderColor: 'rgba(134,46,156,0.4)' },
                position: 'relative', overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #862e9c, #c77dff)',
                },
              }}>
                <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'primary.main', fontWeight: 700 }}>
                  Get in touch
                </Typography>
                <InfoRow icon={MAIL_ICON} href="mailto:astorijanova@yahoo.com">
                  astorijanova@yahoo.com
                </InfoRow>
                <InfoRow icon={PHONE_ICON} href="tel:+38970210128">
                  070-210-128
                </InfoRow>
                <InfoRow icon={CLOCK_ICON}>
                  Mon – Fri &nbsp;08:00 – 18:00
                </InfoRow>
              </Box>
            </RevealBox>

          </Box>
        </Box>
      </Container>
    </Box>
  )
}