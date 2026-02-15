import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'
import { blogArticles } from '@/lib/blog-data'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
    title: 'Blog — Mortgage Tips, Guides & Resources',
    description:
        'Expert mortgage advice, homebuying guides, and financial tips to help you make smarter decisions. Stay informed with the Lumina blog.',
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: `Blog | ${SITE_CONFIG.name}`,
        description:
            'Expert mortgage advice, homebuying guides, and financial tips to help you make smarter decisions.',
    },
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default function BlogPage() {
    const featured = blogArticles[0]
    const rest = blogArticles.slice(1)

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#60A5FA]/5 rounded-full blur-[100px]" />
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        Resources & Guides
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                        Lumina Blog
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed">
                        Expert mortgage advice, homebuying guides, and financial tips to help you make smarter decisions on your path to homeownership.
                    </p>
                </div>
            </section>

            {/* Featured Article */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <Link href={`/blog/${featured.slug}`} className="group block">
                        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${featured.coverGradient} p-8 md:p-12 min-h-[320px] flex items-end transition-all group-hover:shadow-2xl`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10 max-w-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-white">
                                        {featured.category}
                                    </span>
                                    <span className="text-white/60 text-sm">{featured.readTime}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:text-[#93C5FD] transition-colors">
                                    {featured.title}
                                </h2>
                                <p className="text-white/70 text-base md:text-lg leading-relaxed mb-4">
                                    {featured.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-white/50 text-sm">
                                    <span>{featured.author}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/30" />
                                    <span>{formatDate(featured.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Article Grid */}
            <section className="pb-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold text-[#1E3A5F] mb-8">All Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rest.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="group block"
                            >
                                <article className="h-full rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#3B82F6]/30 transition-all">
                                    {/* Card Header Gradient */}
                                    <div className={`h-3 bg-gradient-to-r ${article.coverGradient}`} />
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-xs font-medium text-[#2563EB]">
                                                {article.category}
                                            </span>
                                            <span className="text-gray-400 text-xs">{article.readTime}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1E3A5F] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                                            <span>{article.author}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{formatDate(article.publishedAt)}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-4">
                            Ready to put this knowledge to work?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                            Get pre-approved in minutes and compare rates from 50+ lenders. Your perfect mortgage is just a few clicks away.
                        </p>
                        <Link href="/apply">
                            <button className="px-8 py-4 rounded-full text-lg font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
