import Box from '@mui/material/Box'
import LinkButton from '@/components/LinkButton'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getActivePromotions, soonestEnd } from '@/lib/promotions'
import { yearsOfExperience } from '@/content'
import { discountPercent } from '@/lib/pricing'
import PromoCard from '@/components/promo/PromoCard'
import Countdown from '@/components/promo/Countdown'

export const revalidate = 60

export const metadata = {
  title: 'Промоции — Асторија',
  description:
    'Актуелни промоции и попусти на печатење: визитки, рецепти, флаери и повеќе. Ограничени понуди со плаќање при достава низ цела Македонија.',
  alternates: { canonical: '/promocii' },
  openGraph: {
    title: 'Промоции — Асторија',
    description: 'Актуелни попусти на печатење. Ограничени понуди.',
    url: '/promocii',
    siteName: 'Асторија',
    locale: 'mk_MK',
    type: 'website',
  },
}

const BENEFITS = [
  {
    Icon: LocalShippingOutlinedIcon,
    title: 'Бесплатна достава',
    text: 'Испорака до вашата врата низ цела Македонија.',
  },
  {
    Icon: PaymentsOutlinedIcon,
    title: 'Плаќање при достава',
    text: 'Платете кога ќе ја примите нарачката — без картички.',
  },
  {
    Icon: WorkspacePremiumOutlinedIcon,
    title: `${yearsOfExperience} години искуство`,
    text: 'Иста квалитетна изработка, и на промотивна цена.',
  },
]

export default async function PromotionsPage() {
  const promotions = await getActivePromotions()
  const endsAt = soonestEnd(promotions)
  const maxPercent = promotions.reduce(
    (max, p) => Math.max(max, discountPercent(p.price, p.sale_price)),
    0,
  )

  return (
    <>
      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
          pt: { xs: 6, md: 9 },
          pb: { xs: 12, md: 16 },
          background:
            'radial-gradient(ellipse 55% 75% at 90% 10%, rgba(232,54,93,0.28) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(174,62,201,0.4) 0%, transparent 60%),' +
            'linear-gradient(160deg, #1a0a24 0%, #2a0f3a 55%, #3a1050 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            <Box sx={{ maxWidth: 620 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2.5,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 999,
                  bgcolor: 'rgba(232,54,93,0.16)',
                  border: '1px solid rgba(255,143,166,0.35)',
                  color: '#ffb3c3',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                <LocalOfferIcon sx={{ fontSize: 16 }} />
                {promotions.length > 0
                  ? `${promotions.length} ${promotions.length === 1 ? 'активна понуда' : 'активни понуди'}`
                  : 'Промоции'}
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  fontSize: { xs: '2.4rem', md: '3.6rem' },
                }}
              >
                Промоции
                {maxPercent > 0 ? (
                  <>
                    {' '}
                    <Box
                      component="span"
                      sx={{
                        background: 'linear-gradient(90deg, #ff8fa6, #c77dff)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      до −{maxPercent}%
                    </Box>
                  </>
                ) : null}
              </Typography>
              <Typography
                sx={{ mt: 2, color: 'rgba(255,255,255,0.75)', fontSize: { xs: '1rem', md: '1.15rem' } }}
              >
                Најдобрите цени на нашите најбарани производи — на ограничено време. Нарачајте онлајн,
                платете при достава.
              </Typography>
            </Box>

            {endsAt ? <Countdown endsAt={endsAt} inverted label="Понудата завршува за" /> : null}
          </Box>
        </Container>
      </Box>

      {/* Offers — pulled up over the hero edge */}
      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -11 }, position: 'relative', zIndex: 1 }}>
        {promotions.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2.5, md: 3 },
              gridTemplateColumns: { xs: '1fr', lg: promotions.length > 1 ? '1fr 1fr' : '1fr' },
            }}
          >
            {promotions.map((product) => (
              <PromoCard key={product.id} product={product} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 18px 40px -24px rgba(60,10,80,0.35)',
              px: 3,
              py: { xs: 6, md: 8 },
            }}
          >
            <LocalOfferIcon sx={{ fontSize: 48, color: 'primary.light', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Моментално нема активни промоции
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 440, mx: 'auto' }}>
              Нови понуди стигнуваат често. Во меѓувреме, разгледајте ја целата продавница.
            </Typography>
            <LinkButton
              href="/prodavnica"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2.5 }}
            >
              Кон продавницата
            </LinkButton>
          </Box>
        )}
      </Container>

      {/* Benefits */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          }}
        >
          {BENEFITS.map(({ Icon, title, text }) => (
            <Box
              key={title}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'rgba(134,46,156,0.05)',
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(134,46,156,0.12)',
                  color: 'primary.main',
                }}
              >
                <Icon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Custom-order nudge */}
        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Ви треба поголема количина или посебен дизајн?
            </Typography>
            <Typography color="text.secondary">
              За фирми и поголеми нарачки подготвуваме посебна понуда.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <LinkButton
              href="/contact"
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2.5 }}
            >
              Побарај понуда
            </LinkButton>
            <LinkButton
              href="/prodavnica"
              variant="outlined"
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2.5 }}
            >
              Сите производи
            </LinkButton>
          </Box>
        </Box>
      </Container>
    </>
  )
}
