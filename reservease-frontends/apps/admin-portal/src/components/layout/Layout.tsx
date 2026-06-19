import React from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNavigation } from './BottomNavigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/reset-password'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {!isAuthPage && <Navbar />}

      <main className={`flex-1 flex flex-col ${!isAuthPage ? "container py-8 md:pb-8 pb-24" : ""}`}>
        {children}
      </main>

      {!isAuthPage && (
        <footer className="hidden md:flex border-t h-14 items-center justify-center bg-card text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} ReservEase Admin · All rights reserved
        </footer>
      )}

      {!isAuthPage && <BottomNavigation />}
    </div>
  )
}
