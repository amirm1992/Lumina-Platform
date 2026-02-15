import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/constants'
import { blogArticles, getArticleBySlug, getRelatedArticles } from '@/lib/blog-data'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/landing/Footer'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return blogArticles.map((article) => ({
        slug: article.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const article = getArticleBySlug(slug)
    if (!article) return {}

    return {
        title: article.title,
        description: article.excerpt,
        alternates: {
            canonical: `/blog/${article.slug}`,
        },
        openGraph: {
            title: `${article.title} | ${SITE_CONFIG.name}`,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.publishedAt,
            authors: [article.author],
        },
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default async function BlogArticlePage({ params }: PageProps) {
    const { slug } = await params
    const article = getArticleBySlug(slug)

    if (!article) {
        notFound()
    }

    const relatedArticles = getRelatedArticles(slug, 3)

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Article Hero */}
            <section className={`relative pt-32 pb-16 bg-gradient-to-br ${article.coverGradient} overflow-hidden`}>
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
                </div>
                <div className="relative z-10 container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back to Blog
                        </Link>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-white">
                                {article.category}
                            </span>
                            <span className="text-white/60 text-sm">{article.readTime}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-3 text-white/50 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                                {article.author.charAt(0)}
                            </div>
                            <span className="text-white/70">{article.author}</span>
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:text-[#1E3A5F] prose-headings:font-bold
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-li:text-gray-600
                                prose-strong:text-[#1E3A5F]
                                prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline
                                prose-ul:space-y-2"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Divider */}
                        <div className="border-t border-gray-200 mt-12 pt-8">
                            <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-2xl p-8 border border-[#93C5FD]/30">
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
                                    Ready to take the next step?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Get pre-approved in minutes and compare rates from 50+ lenders through our AI-powered platform.
                                </p>
                                <Link
                                    href="/apply"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25"
                                >
                                    Get Started
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-16 bg-[#F8FAFC]">
                    <div className="container mx-auto px-6">
                        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-8">Related Articles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="group block"
                                >
                                    <article className="h-full rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#3B82F6]/30 transition-all bg-white">
                                        <div className={`h-3 bg-gradient-to-r ${related.coverGradient}`} />
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-xs font-medium text-[#2563EB]">
                                                    {related.category}
                                                </span>
                                                <span className="text-gray-400 text-xs">{related.readTime}</span>
                                            </div>
                                            <h3 className="text-base font-bold text-[#1E3A5F] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                                                {related.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    )
}
