import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedIn from './components/FeaturedIn'
import Process from './components/Process'
import Products from './components/Products'
import WeDesignEverything from './components/WeDesignEverything'
import Stats from './components/Stats'
import Services from './components/Services'
import Contact from './components/Contact'
import About from './components/About'
import Footer from './components/Footer'

export default function App() {
    const [navOpen, setNavOpen] = useState(false)
    const [sticky, setSticky] = useState(false)

    useEffect(()=>{
        // Smooth scrolling for internal anchors (delegated)
        function onDocClick(e){
            const a = e.target.closest && e.target.closest('a')
            if(!a) return
            const href = a.getAttribute('href')
            if(!href || !href.startsWith('#')) return
            e.preventDefault()
            if(href === '#'){
                window.scrollTo({top:0, behavior:'smooth'})
                return
            }
            const target = document.querySelector(href)
            if(target) target.scrollIntoView({behavior:'smooth', block:'start'})
        }

        document.addEventListener('click', onDocClick)
        return ()=> document.removeEventListener('click', onDocClick)
    },[])

    useEffect(()=>{
        // Intersection observer to toggle sticky header when hero is out of view
        const hero = document.querySelector('#hero')
        if(!hero) return
        const observer = new IntersectionObserver((entries)=>{
            const ent = entries[0]
            setSticky(!ent.isIntersecting)
        }, { root:null, threshold:0, rootMargin: '-80px' })

        observer.observe(hero)
        return ()=> observer.disconnect()
    },[])

    useEffect(()=>{
        // Check flex gap support and add class to body if missing (compat shim)
        function checkFlexGap(){
            const flex = document.createElement('div')
            flex.style.display = 'flex'
            flex.style.flexDirection = 'column'
            flex.style.rowGap = '1px'
            flex.appendChild(document.createElement('div'))
            flex.appendChild(document.createElement('div'))
            document.body.appendChild(flex)
            const isSupported = flex.scrollHeight === 1
            flex.parentNode.removeChild(flex)
            if(!isSupported) document.body.classList.add('no-flexbox-gap')
        }
        checkFlexGap()
    },[])

    return (
        <div id="app-root">
            <Header navOpen={navOpen} setNavOpen={setNavOpen} sticky={sticky} />
            <main>
                <Hero />
                <FeaturedIn />
                <Stats />
                <Process />
                <Products />
                <WeDesignEverything />
                <Services />
                <Contact />
                <About />
            </main>
            <Footer />
        </div>
    )
}