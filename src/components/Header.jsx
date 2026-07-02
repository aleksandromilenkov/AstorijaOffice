import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTranslations } from '../translations'

export default function Header({navOpen, setNavOpen, sticky = false}){
  const { t, language, setLanguage, languages } = useTranslations()
  const [anchorEl, setAnchorEl] = useState(null)

  const toggleNav = () => setNavOpen(!navOpen)
  const closeNav = () => setNavOpen(false)

  const navItems = t.header.nav
  const currentLanguage = languages.find((item) => item.code === language) || languages[0]
  const open = Boolean(anchorEl)

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleLanguageClose = () => setAnchorEl(null)
  const handleLanguageSelect = (code) => {
    setLanguage(code)
    handleLanguageClose()
  }

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backgroundColor: sticky ? 'background.paper' : 'transparent',
          boxShadow: sticky ? 3 : 'none'
        }}
      >
        <Toolbar sx={{display:'flex', justifyContent:'space-between', minHeight: sticky ? 64 : 96}}>
          <Box component="a" href="#" sx={{display:'inline-flex', alignItems:'center'}}>
            <img src="/img/Screenshot_1.png" alt="Astorija logo" style={{height:56}} />
          </Box>

          <Box sx={{display:{xs:'none', md:'flex'}, alignItems:'center', gap:2}}>
            {navItems.map((item)=> (
              <Button key={item.label} href={item.href} variant={item.variant || 'text'} color="primary" sx={{ textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' }}>
                {item.label}
              </Button>
            ))}

            <Button
              color="primary"
              endIcon={<ArrowDropDownIcon />}
              onClick={handleLanguageClick}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              <Box component="span" sx={{ mr: 1 }}>{currentLanguage.flag}</Box>
              {t.header.language}
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <Button
              color="primary"
              onClick={handleLanguageClick}
              sx={{ textTransform: 'none', minWidth: 0, px: 1.5, py: 0.75, borderRadius: 2, fontSize: '0.825rem', backgroundColor: 'rgba(255,255,255,0.08)', color: 'text.primary' }}
            >
              <Box component="span" sx={{ mr: 0.75 }}>{currentLanguage.flag}</Box>
              <ArrowDropDownIcon sx={{ fontSize: 20, ml: 0.25 }} />
            </Button>
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleNav} sx={{ p: 1.25, bgcolor: 'rgba(255,255,255,0.08)' }}>
              {navOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleLanguageClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} selected={lang.code === language} onClick={() => handleLanguageSelect(lang.code)}>
            <Box component="span" sx={{ mr: 1 }}>{lang.flag}</Box>
            <Typography>{t.header.languageNames[lang.code]}</Typography>
          </MenuItem>
        ))}
      </Menu>

      <Drawer
        anchor="right"
        open={navOpen}
        onClose={closeNav}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: '24px 0 0 24px',
            px: 0,
            py: 0,
            boxShadow: '0 24px 68px rgba(15, 15, 15, 0.22)',
            backgroundImage: 'linear-gradient(180deg, rgba(250,250,250,0.96) 0%, rgba(255,255,255,0.98) 100%)',
          },
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.14em' }}>
              Menu
            </Typography>
            <IconButton onClick={closeNav} sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List disablePadding>
            {navItems.map((item)=> (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={closeNav}
                  sx={{ py: 2.5, px: 3, gap: 2, '&:hover': { bgcolor: 'rgba(134,46,156,0.08)' } }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.01em' }}>
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
