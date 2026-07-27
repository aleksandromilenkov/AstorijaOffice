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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Badge from '@mui/material/Badge'
import { useCart } from '@/store/CartContext'
import { navLinks } from '@/content'
import HeaderSearch from '@/components/HeaderSearch'

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
            minHeight: sticky ? 64 : 96,
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <img src="/img/Screenshot_1.png" alt="Astorija logo" style={{ height: 56 }} />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, flex: 1, ml: 3 }}>
            <HeaderSearch />
            {navLinks.map((item) => (
              <Button
                key={item.label}
                component={isInternalPage(item.href) ? Link : 'a'}
                href={item.href}
                variant={item.variant || 'text'}
                color="primary"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {item.label}
              </Button>
            ))}
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
                <ShoppingCartIcon />
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
                    '&:hover': { bgcolor: 'rgba(134,46,156,0.08)' },
                  }}
                >
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
