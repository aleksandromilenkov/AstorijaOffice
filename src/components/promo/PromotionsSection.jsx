import Box from '@mui/material/Box'
import LinkButton from '@/components/LinkButton'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { getActivePromotions, soonestEnd } from '@/lib/promotions'
import PromoCard from './PromoCard'
import Countdown from './Countdown'

/**
 * Home page "Промоции" band. Server component: reads active promotions
 * and renders nothing at all when there are none, so the home page never
 * shows an empty promo block.
 */
export default async function PromotionsSection() {
  const all = await getActivePromotions()
  if (all.length === 0) return null

  const featured = all.slice(0, 2)
  const endsAt = soonestEnd(featured)

  return (
    <Box
      component="section"
      id="promocii"
      aria-labelledby="promo-heading"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, md: 10 },
        background:
          'radial-gradient(ellipse 60% 70% at 85% 0%, rgba(242,106,27,0.22) 0%, transparent 60%),' +
          'radial-gradient(ellipse 70% 80% at 0% 100%, rgba(179,18,29,0.35) 0%, transparent 60%),' +
          'linear-gradient(160deg, #141619 0%, #1d2024 55%, #272b30 100%)',
        color: '#fff',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            gap: 3,
            mb: { xs: 4, md: 5 },
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                px: 1.5,
                py: 0.6,
                borderRadius: 999,
                bgcolor: 'rgba(242,106,27,0.16)',
                border: '1px solid rgba(255,179,122,0.35)',
                color: '#ffd1ad',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <LocalOfferIcon sx={{ fontSize: 16 }} /> Промоции
            </Box>
            <Typography
              id="promo-heading"
              variant="h2"
              sx={{
                fontWeight: 900,
                lineHeight: 1.1,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Попусти што{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #ffb37a, #ff6b6b)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                не смеете да ги пропуштите
              </Box>
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem' }}>
              Ограничени понуди на нашите најбарани производи. Истата квалитетна изработка —
              пониска цена.
            </Typography>
          </Box>

          {endsAt ? <Countdown endsAt={endsAt} inverted label="Понудата завршува за" /> : null}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2.5, md: 3 },
            gridTemplateColumns: { xs: '1fr', lg: featured.length > 1 ? '1fr 1fr' : '1fr' },
          }}
        >
          {featured.map((product, i) => (
            <div key={product.id} className="a-fade-up" style={{ '--d': `${150 + i * 140}ms` }}>
              <PromoCard product={product} />
            </div>
          ))}
        </Box>

        <Box sx={{ mt: { xs: 4, md: 5 }, display: 'flex', justifyContent: 'center' }}>
          <LinkButton
            href="/promocii"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              color: '#fff',
              px: 3,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: '#fff' },
            }}
          >
            {all.length > featured.length
              ? `Види ги сите ${all.length} промоции`
              : 'Сите промоции'}
          </LinkButton>
        </Box>
      </Container>
    </Box>
  )
}
