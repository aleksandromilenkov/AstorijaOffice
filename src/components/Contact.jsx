import React, { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslations } from '../translations'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const MAIL_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const PHONE_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
  </svg>
)
const PIN_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const SEND_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const INFO = [
  { icon: MAIL_ICON,  href: 'mailto:astorijanova@yahoo.com', text: 'astorijanova@yahoo.com' },
  { icon: PHONE_ICON, href: 'tel:+38970210128',              text: '070-210-128' },
  { icon: PHONE_ICON, href: 'tel:+38932444466',              text: '032-444-466' },
  { icon: PIN_ICON,   href: null,                            text: 'Leninova 24, Sveti Nikole' },
]

const FIELD_SX = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#ae3ec9' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: 2,
    fontSize: '0.92rem',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(134,46,156,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#862e9c' },
  },
}

export default function Contact() {
  const formRef = useRef()
  const sectionRef = useRef()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const sendEmail = (e) => {
    e.preventDefault()
    setLoading(true)
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setLoading(false)
        setSnackbar({ open: true, message: t.contact.snackbar.success, severity: 'success' })
        formRef.current.reset()
      }, (err) => {
        setLoading(false)
        setSnackbar({ open: true, message: `${t.contact.snackbar.error} ${err.text || ''}`.trim(), severity: 'error' })
      })
  }

  const { t } = useTranslations()

  return (
    <Box
      id="contact"
      component="section"
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        // Grid background
        backgroundImage: `
          linear-gradient(rgba(134,46,156,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(134,46,156,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%', right: '-10%',
          width: '50vw', height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,46,156,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Box sx={{
          textAlign: 'center', mb: { xs: 6, md: 8 },
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <Typography sx={{
            fontSize: '0.65rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'primary.main',
            fontWeight: 700, mb: 1.5, display: 'block',
          }}>
            {t.contact.overline}
          </Typography>
          <Typography sx={{
            fontSize: { xs: '2rem', md: '2.8rem' },
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
            color: '#fff',
          }}>
            {t.contact.title}
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', maxWidth: 400, mx: 'auto' }}>
            {t.contact.subtitle}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">

          {/* LEFT — contact info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {INFO.map(({ icon, href, text }, i) => (
                <Box
                  key={text}
                  component={href ? 'a' : 'div'}
                  href={href}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    p: 2, borderRadius: 2,
                    border: '1px solid rgba(134,46,156,0.15)',
                    background: 'rgba(134,46,156,0.06)',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s, border-color 0.22s, background 0.22s, color 0.22s`,
                    '&:hover': href ? {
                      borderColor: 'rgba(134,46,156,0.45)',
                      background: 'rgba(134,46,156,0.12)',
                      color: '#fff',
                    } : {},
                  }}
                >
                  <Box sx={{ color: '#862e9c', flexShrink: 0 }}>{icon}</Box>
                  {text}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* RIGHT — form */}
          <Grid item xs={12} md={8}>
            <Box
              component="form"
              ref={formRef}
              onSubmit={sendEmail}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid rgba(134,46,156,0.15)',
                background: 'rgba(134,46,156,0.04)',
                backdropFilter: 'blur(12px)',
                display: 'flex', flexDirection: 'column', gap: 2.5,
                position: 'relative', overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(24px)',
                transition: 'opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, #862e9c, #c77dff)',
                },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label={t.contact.fields.name}  name="from_name" required fullWidth variant="outlined" sx={FIELD_SX} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label={t.contact.fields.email} name="reply_to"  required fullWidth variant="outlined" type="email" sx={FIELD_SX} />
                </Grid>
              </Grid>

              <TextField label={t.contact.fields.subject} name="subject" required fullWidth variant="outlined" sx={FIELD_SX} />

              <TextField
                label={t.contact.fields.message} name="message" required fullWidth
                multiline rows={5} variant="outlined" sx={FIELD_SX}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? null : SEND_ICON}
                sx={{
                  py: 1.6, fontWeight: 700, borderRadius: 2,
                  fontSize: '0.92rem', textTransform: 'none',
                  alignSelf: 'flex-start',
                  px: 4,
                  background: 'linear-gradient(135deg, #862e9c, #ae3ec9)',
                  boxShadow: '0 4px 20px rgba(134,46,156,0.35)',
                  transition: 'all 0.25s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 28px rgba(134,46,156,0.55)',
                  },
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : t.contact.submit}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}