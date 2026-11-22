'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import MailOutlineIcon from '@mui/icons-material/EmailOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import Logo from '@/components/brand/Logo'
import { company, footer, fullAddress } from '@/content'

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${company.address}, ${company.city}`,
)}`

const SHOP_LINKS = [
  { label: 'Продавница', href: '/prodavnica' },
  { label: 'Промоции', href: '/promocii' },
  { label: 'Следи нарачка', href: '/sledenje' },
  { label: 'Кошничка', href: '/kosnicka' },
]
const INFO_LINKS = [
  { label: 'За нас', href: '/about' },
  { label: 'Контакт', href: '/contact' },
  { label: 'Услови за купување и достава', href: '/uslovi' },
]

const linkSx = {
  color: 'rgba(255,255,255,0.72)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  transition: 'color 0.2s',
  '&:hover': { color: '#fff' },
}

function ColTitle({ children }) {
  return (
    <Typography
      component="h2"
      sx={{
        fontSize: '0.72rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#d9a6ea',
        fontWeight: 800,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  )
}

function IconLine({ icon, children, href }) {
  const content = (
    <>
      <Box component="span" sx={{ display: 'inline-flex', mt: '2px', color: '#d9a6ea' }}>
        {icon}
      </Box>
      <Box component="span">{children}</Box>
    </>
  )
  const sx = { ...linkSx, display: 'flex', gap: 1.25, alignItems: 'flex-start' }
  return href ? (
    <Box component="a" href={href} sx={sx} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
      {content}
    </Box>
  ) : (
    <Box sx={{ ...sx, '&:hover': {} }}>{content}</Box>
  )
}

export default function Footer() {
  const iconSx = { fontSize: 18 }
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        color: '#fff',
        background:
          'radial-gradient(ellipse 60% 60% at 100% 0%, rgba(232,54,93,0.10) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(134,46,156,0.22) 0%, transparent 60%),' +
          '#160b20',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 3,
          background: 'linear-gradient(90deg, #862e9c, #e8365d)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 11, md: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 5 },
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.5fr 1fr 1.1fr 1.4fr' },
          }}
        >
          {/* Brand */}
          <Box>
            <Box component={Link} href="/" aria-label="Асторија — почетна" sx={{ display: 'inline-flex' }}>
              <Logo tone="light" height={46} />
            </Box>
            <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: 320 }}>
              {footer.tagline} Визитки, флаери, маички, обрасци и брендирани производи — со
              бесплатна достава низ цела Македонија.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2.5, flexWrap: 'wrap' }}>
              <Box
                component="a"
                href={company.phones[0].href}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.75,
                  py: 0.9,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #862e9c, #ae3ec9)',
                  '&:hover': { filter: 'brightness(1.1)' },
                }}
              >
                <PhoneOutlinedIcon sx={iconSx} /> {company.phones[0].text}
              </Box>
              <Box
                component="a"
                href={`viber://chat?number=${encodeURIComponent(company.viber)}`}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.75,
                  py: 0.9,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: '1px solid rgba(255,255,255,0.25)',
                  '&:hover': { borderColor: '#fff' },
                }}
              >
                Пишете на Viber
              </Box>
            </Box>
          </Box>

          {/* Shop */}
          <Box component="nav" aria-label="Продавница">
            <ColTitle>Продавница</ColTitle>
            <Box sx={{ display: 'grid', gap: 1.1 }}>
              {SHOP_LINKS.map((l) => (
                <Box key={l.href} component={Link} href={l.href} sx={linkSx}>
                  {l.label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Info */}
          <Box component="nav" aria-label="Информации">
            <ColTitle>Информации</ColTitle>
            <Box sx={{ display: 'grid', gap: 1.1 }}>
              {INFO_LINKS.map((l) => (
                <Box key={l.href} component={Link} href={l.href} sx={linkSx}>
                  {l.label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <ColTitle>{footer.contact}</ColTitle>
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              <IconLine icon={<PlaceOutlinedIcon sx={iconSx} />} href={mapsHref}>
                {fullAddress}
              </IconLine>
              {company.phones.map((p) => (
                <IconLine key={p.href} icon={<PhoneOutlinedIcon sx={iconSx} />} href={p.href}>
                  {p.text}
                </IconLine>
              ))}
              <IconLine icon={<MailOutlineIcon sx={iconSx} />} href={`mailto:${company.email}`}>
                {company.email}
              </IconLine>
              <IconLine icon={<ScheduleOutlinedIcon sx={iconSx} />}>
                {company.hours.days}
                <br />
                {company.hours.time}
                <br />
                <Box component="span" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {company.hours.closed}: {footer.closed}
                </Box>
              </IconLine>
            </Box>
          </Box>
        </Box>

        {/* Promise strip */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            py: 2,
            px: 2.5,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, md: 4 },
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingOutlinedIcon sx={{ ...iconSx, color: '#d9a6ea' }} /> Бесплатна достава во сите 80 општини
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentsOutlinedIcon sx={{ ...iconSx, color: '#d9a6ea' }} /> Плаќање при достава · фактура за фирми
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 1,
            // keep clear of the floating contact button
            pr: { md: 10 },
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
          }}
        >
          <span>
            © {new Date().getFullYear()} {company.name}. {footer.reserved}
          </span>
          <span>{footer.dooel}</span>
        </Box>
      </Container>
    </Box>
  )
}
