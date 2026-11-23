'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import CartIcon from '@/components/store/CartIcon'
import HomeIcon from '@mui/icons-material/Home'
import StorefrontIcon from '@mui/icons-material/Storefront'
import InfoIcon from '@mui/icons-material/Info'
import EmailIcon from '@mui/icons-material/Email'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import Badge from '@mui/material/Badge'
import { useCart } from '@/store/CartContext'
import { navLinks } from '@/content'
import HeaderSearch from '@/components/HeaderSearch'
import Logo from '@/components/brand/Logo'

/**
 * Decide if a nav link points to an in-page hash on the home page, a
 * different page, or a fully external resource. We use this to render
 * the right element (Next.js Link vs anchor) and to know whether the
 * link should close the mobile drawer immediately.
 */
function isInternalPage(href) {
  return href.startsWith('/') && !href.startsWith('/#')
}

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { count } = useCart()

  const closeNav = () => setNavOpen(false)

  // Smooth scroll for in-page hash links (e.g. "/#products").
  useEffect(() => {
    function onDocClick(e) {
      const a = e.target.closest && e.target.closest('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href) return

      // Only intercept when we're on the home page and the link is a hash.
      if (isHome && href.startsWith('/#')) {
        const id = href.replace('/#', '')
        const target = id ? document.getElementById(id) : null
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          closeNav()
        } else if (id === '') {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          closeNav()
        }
      } else if (isHome && href === '#') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        closeNav()
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [isHome])

  // On non-home routes the header is always "stuck". On the home page
  // we toggle once the hero scrolls out of view via IntersectionObserver.
  const sticky = useStickyHeader(isHome)

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backgroundColor: sticky ? 'background.paper' : 'transparent',
          boxShadow: sticky ? 3 : 'none',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: sticky ? 64 : 80,
          }}
        >
          <Box
            component={Link}
            href="/"
            aria-label="Асторија — почетна"
            className="logo-link"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              '& svg': { height: { xs: 34, md: sticky ? 38 : 44 }, width: 'auto', transition: 'height 0.2s' },
            }}
          >
            <Logo height={44} />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, flex: 1, ml: 3 }}>
            <HeaderSearch />
            {navLinks.filter((item) => !item.drawerOnly).map((item) => {
              // Map icon strings from content.js to actual MUI components
              const IconComponent = {
                Home: HomeIcon,
                Storefront: StorefrontIcon,
                Info: InfoIcon,
                Email: EmailIcon,
                LocalOffer: LocalOfferIcon,
              }[item.icon] || null

              return (
                <Button
                  key={item.label}
                  component={isInternalPage(item.href) ? Link : 'a'}
                  href={item.href}
                  variant={item.variant || 'text'}
                  color="primary"
                  startIcon={IconComponent ? <IconComponent /> : null}
                  sx={{
                    textTransform: 'none',
                    fontWeight: item.accent ? 800 : 600,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    ...(item.variant === 'contained'
                      ? {}
                      : {
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 12,
                            right: 12,
                            bottom: 4,
                            height: 2,
                            borderRadius: 2,
                            bgcolor: 'currentColor',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                          },
                          '&:hover::after': { transform: 'scaleX(1)' },
                          '&:hover': { bgcolor: 'transparent' },
                        }),
                    // Icons only on wide screens, so the search keeps its room.
                    '& .MuiButton-startIcon': { display: { md: 'none', lg: 'inherit' } },
                    ...(item.accent ? { color: 'sale.main', '&:hover': { bgcolor: 'rgba(242,106,27,0.08)' } } : {}),
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              component={Link}
              href="/kosnicka"
              aria-label="Отвори кошничка"
              color="primary"
              sx={{ p: 1.25 }}
            >
              <Badge
                badgeContent={count}
                color="secondary"
                overlap="circular"
                max={99}
              >
                <CartIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setNavOpen((o) => !o)}
              sx={{ p: 1.25, bgcolor: 'rgba(255,255,255,0.08)' }}
            >
              {navOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={navOpen}
        onClose={closeNav}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              bgcolor: 'background.paper',
              borderRadius: '24px 0 0 24px',
              px: 0,
              py: 0,
              boxShadow: '0 24px 68px rgba(15, 15, 15, 0.22)',
              backgroundImage:
                'linear-gradient(180deg, rgba(250,250,250,0.96) 0%, rgba(255,255,255,0.98) 100%)',
            },
          },
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2.5,
              borderBottom: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, letterSpacing: '0.14em' }}
            >
              Мени
            </Typography>
            <IconButton onClick={closeNav} sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List disablePadding>
            {navLinks.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={isInternalPage(item.href) ? Link : 'a'}
                  href={item.href}
                  onClick={closeNav}
                  sx={{
                    py: 2.5,
                    px: 3,
                    gap: 2,
                    '&:hover': { bgcolor: 'rgba(215,31,43,0.08)' },
                  }}
                >
                  {/* Render icon manually since ListItemButton doesn't have startIcon */}
                  {(() => {
                    const IconComponent = {
                      Home: HomeIcon,
                      Storefront: StorefrontIcon,
                      Info: InfoIcon,
                      Email: EmailIcon,
                      LocalOffer: LocalOfferIcon,
                      LocalShipping: LocalShippingOutlinedIcon,
                    }[item.icon]
                    return IconComponent ? <IconComponent sx={{ mr: 1.5, color: item.accent ? 'sale.main' : 'primary.main' }} /> : null
                  })()}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {item.label}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

/**
 * Header "stuck" state for the sticky background/shadow effect.
 *
 * Returns `true` when the user has scrolled past the hero on the home
 * page. On non-home routes the header is always considered stuck, so
 * we return `true` immediately without ever touching DOM.
 *
 * The IntersectionObserver callback is the only place we call
 * setState — it's an external subscription, so this is the lint-clean
 * way to model "DOM event → React state".
 */
function useStickyHeader(isHome) {
  const [sticky, setSticky] = useState(!isHome)

  useEffect(() => {
    if (!isHome) return undefined
    const hero = document.querySelector('#hero')
    if (!hero) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const ent = entries[0]
        setSticky(!ent.isIntersecting)
      },
      { root: null, threshold: 0, rootMargin: '-80px' }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [isHome])

  return sticky
}
