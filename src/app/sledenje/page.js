import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import TrackOrderClient from '@/components/track/TrackOrderClient'

export const metadata = {
  title: 'Следи нарачка — Асторија',
  description:
    'Проверете каде е вашата нарачка: внесете го бројот на нарачката и телефонот.',
  alternates: { canonical: '/sledenje' },
  robots: { index: true, follow: true },
}

export default async function TrackOrderPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const initialCode = typeof sp.kod === 'string' ? sp.kod.slice(0, 12) : ''

  return (
    <>
      <Box
        component="section"
        sx={{
          color: '#fff',
          pt: { xs: 6, md: 8 },
          pb: { xs: 12, md: 14 },
          background:
            'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(179,18,29,0.4) 0%, transparent 60%),' +
            'linear-gradient(160deg, #141619 0%, #1d2024 55%, #272b30 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              px: 1.5,
              py: 0.6,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} /> Статус на нарачка
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              fontSize: { xs: '2.3rem', md: '3.2rem' },
            }}
          >
            Следи нарачка
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,0.75)', fontSize: { md: '1.1rem' } }}>
            Внесете го бројот на нарачката и телефонот што го оставивте при нарачување.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: { xs: -9, md: -10 }, mb: { xs: 6, md: 10 }, position: 'relative' }}>
        <TrackOrderClient initialCode={initialCode} />
      </Container>
    </>
  )
}
