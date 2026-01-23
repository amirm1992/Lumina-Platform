import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </main>
    )
}
