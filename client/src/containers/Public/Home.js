import React, { useEffect, useRef } from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation, Search } from './index'
import { Intro, Contact } from '../../components'
import { path } from '../../ultils/constant'
import ChatForm from '../../components/ChatForm'
import { useSelector } from 'react-redux'
import ChatList from '../../components/ChatList'


const Home = () => {
    const location = useLocation()
    const navRef = useRef()
    const { openChat } = useSelector(state => state.app)

    useEffect(() => {
        const handleScroll = (e) => {
            if (window.pageYOffset >= 134) {
                navRef.current.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 50;
                `
            } else {
                navRef.current.style.cssText = `width: 100%`
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    return (
        <div className='w-full flex gap-6 flex-col items-center h-full'>
            <Header />
            <div ref={navRef} className='w-full'>
                <Navigation />
            </div>
            {location.pathname !== `/${path.CONTACT}` && location.pathname !== `/${path.LOGIN}` && !location.pathname?.includes(path.DETAIL) && !location.pathname?.includes(path.WISHLIST) && <Search />}
            <div className='w-4/5 lg:w-3/5 flex flex-col items-start justify-start mt-3'>
                <Outlet />
            </div>
            <Intro />
            <Contact />
            <div className='h-[500px]'>

            </div>
            {openChat && <ChatForm />}
            <ChatList />
        </div>
    )
}

export default Home