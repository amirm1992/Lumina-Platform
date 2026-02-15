// ============================================
// Blog articles data
// Static content for the Lumina blog
// ============================================

export interface BlogArticle {
    slug: string
    title: string
    excerpt: string
    category: string
    readTime: string
    publishedAt: string
    author: string
    coverGradient: string // Tailwind gradient classes for the card
    content: string // Full article content in HTML-safe text
}

export const blogArticles: BlogArticle[] = [
    {
        slug: 'first-time-homebuyer-guide-2025',
        title: 'The Complete First-Time Homebuyer Guide for 2025',
        excerpt:
            'Everything you need to know before buying your first home — from saving for a down payment to closing day. A step-by-step roadmap for new buyers.',
        category: 'Homebuying',
        readTime: '8 min read',
        publishedAt: '2025-12-15',
        author: 'Lumina Team',
        coverGradient: 'from-[#1E3A5F] to-[#2563EB]',
        content: `
            <h2>Starting Your Homebuying Journey</h2>
            <p>Buying your first home is one of the most significant financial decisions you'll ever make. It can feel overwhelming, but with the right preparation and guidance, the process becomes much more manageable. This guide walks you through every step.</p>

            <h2>Step 1: Assess Your Financial Health</h2>
            <p>Before you start browsing listings, take an honest look at your finances. Lenders will evaluate your credit score, debt-to-income ratio, savings, and employment history.</p>
            <ul>
                <li><strong>Credit Score:</strong> Most conventional loans require a minimum score of 620. FHA loans may accept scores as low as 580. Check your score for free through your bank or credit card provider.</li>
                <li><strong>Debt-to-Income Ratio (DTI):</strong> This is your total monthly debt payments divided by your gross monthly income. Most lenders prefer a DTI of 43% or lower.</li>
                <li><strong>Savings:</strong> You'll need funds for a down payment (3-20% of the home price), closing costs (2-5%), and an emergency fund.</li>
            </ul>

            <h2>Step 2: Get Pre-Approved</h2>
            <p>A mortgage pre-approval is a lender's conditional commitment to lend you a specific amount. It shows sellers you're a serious buyer and helps you understand your budget. With Lumina, you can get pre-approved in minutes through our digital platform.</p>
            <p>During pre-approval, the lender will review your income, assets, debts, and credit history. You'll receive a pre-approval letter stating the maximum loan amount you qualify for.</p>

            <h2>Step 3: Determine Your Budget</h2>
            <p>Just because you're approved for a certain amount doesn't mean you should borrow that much. Consider your monthly comfort level, future expenses, property taxes, homeowner's insurance, and potential HOA fees. A good rule of thumb: your total housing costs should not exceed 28-30% of your gross monthly income.</p>

            <h2>Step 4: Find the Right Home</h2>
            <p>Work with a real estate agent who knows your target area. Make a list of must-haves versus nice-to-haves. Visit multiple properties and don't rush the decision. Consider factors like commute time, school districts, neighborhood safety, and future resale value.</p>

            <h2>Step 5: Make an Offer and Close</h2>
            <p>Once you find the right home, your agent will help you craft a competitive offer. After acceptance, you'll enter the closing process which includes a home inspection, appraisal, final loan approval, and signing closing documents. The entire process typically takes 30-45 days from offer to keys.</p>

            <h2>First-Time Buyer Programs</h2>
            <p>Don't forget to explore first-time buyer assistance programs. Many states and local governments offer down payment assistance, tax credits, and reduced interest rates for first-time buyers. FHA loans are particularly popular for first-time buyers due to their lower down payment requirements and more flexible credit standards.</p>
        `,
    },
    {
        slug: 'understanding-mortgage-rates',
        title: 'Understanding Mortgage Rates: What Moves Them and How to Get the Best Deal',
        excerpt:
            'Mortgage rates change daily. Learn what factors influence rates, how to lock in a great rate, and strategies to save thousands over the life of your loan.',
        category: 'Rates & Finance',
        readTime: '6 min read',
        publishedAt: '2025-11-28',
        author: 'Lumina Team',
        coverGradient: 'from-[#0F172A] to-[#1E3A5F]',
        content: `
            <h2>What Determines Mortgage Rates?</h2>
            <p>Mortgage rates are influenced by a combination of macroeconomic factors and your personal financial profile. Understanding both can help you time your purchase and optimize your rate.</p>

            <h2>Macroeconomic Factors</h2>
            <ul>
                <li><strong>Federal Reserve Policy:</strong> While the Fed doesn't directly set mortgage rates, its decisions on the federal funds rate influence the broader interest rate environment. When the Fed raises rates, mortgage rates tend to follow.</li>
                <li><strong>Inflation:</strong> Higher inflation generally leads to higher mortgage rates, as lenders need to maintain their real return on investment.</li>
                <li><strong>Bond Market:</strong> Mortgage rates closely track the yield on 10-year U.S. Treasury bonds. When bond yields rise, mortgage rates typically rise too.</li>
                <li><strong>Economic Growth:</strong> A strong economy with low unemployment tends to push rates higher, while economic slowdowns can bring rates down.</li>
            </ul>

            <h2>Personal Factors That Affect Your Rate</h2>
            <ul>
                <li><strong>Credit Score:</strong> The single biggest factor in your individual rate. A score of 760+ typically qualifies for the best rates. Each 20-point drop can add 0.125-0.25% to your rate.</li>
                <li><strong>Down Payment:</strong> A larger down payment (20%+) usually means a lower rate and no private mortgage insurance (PMI).</li>
                <li><strong>Loan Type:</strong> Conventional, FHA, VA, and jumbo loans all have different rate structures.</li>
                <li><strong>Loan Term:</strong> 15-year mortgages typically have lower rates than 30-year mortgages.</li>
                <li><strong>Property Type:</strong> Single-family homes get the best rates. Condos, multi-family, and investment properties may have slightly higher rates.</li>
            </ul>

            <h2>How to Get the Best Rate</h2>
            <p>The most effective strategies include: improving your credit score before applying, saving for a larger down payment, comparing offers from multiple lenders (Lumina does this automatically across 50+ lenders), considering a shorter loan term if affordable, and locking your rate at the right time.</p>

            <h2>When to Lock Your Rate</h2>
            <p>A rate lock guarantees your interest rate for a set period (typically 30-60 days). If rates rise during that period, you're protected. If rates drop significantly, some lenders offer a one-time "float down" option. Your loan officer can advise on the best timing based on current market conditions.</p>
        `,
    },
    {
        slug: 'fha-vs-conventional-loans',
        title: 'FHA vs. Conventional Loans: Which Is Right for You?',
        excerpt:
            'Comparing the two most popular loan types side by side. Learn about down payments, credit requirements, mortgage insurance, and which loan fits your situation.',
        category: 'Loan Types',
        readTime: '7 min read',
        publishedAt: '2025-11-10',
        author: 'Lumina Team',
        coverGradient: 'from-[#1E3A5F] to-[#3B82F6]',
        content: `
            <h2>Two Popular Paths to Homeownership</h2>
            <p>FHA and conventional loans are the two most common mortgage types in America. Each has distinct advantages depending on your financial situation, credit history, and homebuying goals.</p>

            <h2>FHA Loans at a Glance</h2>
            <p>FHA loans are insured by the Federal Housing Administration and are designed to make homeownership accessible to more Americans, especially first-time buyers.</p>
            <ul>
                <li><strong>Minimum Down Payment:</strong> 3.5% with a credit score of 580+</li>
                <li><strong>Credit Score:</strong> Minimum 580 (or 500 with 10% down)</li>
                <li><strong>Mortgage Insurance:</strong> Required for the life of the loan (upfront MIP of 1.75% + annual MIP)</li>
                <li><strong>DTI Ratio:</strong> Up to 50% in some cases</li>
                <li><strong>Best For:</strong> First-time buyers, lower credit scores, smaller down payments</li>
            </ul>

            <h2>Conventional Loans at a Glance</h2>
            <p>Conventional loans are not government-insured and typically follow guidelines set by Fannie Mae and Freddie Mac.</p>
            <ul>
                <li><strong>Minimum Down Payment:</strong> 3% for first-time buyers, 5% for others</li>
                <li><strong>Credit Score:</strong> Minimum 620 (best rates at 740+)</li>
                <li><strong>Mortgage Insurance:</strong> PMI required if down payment is less than 20%, but can be removed once you reach 20% equity</li>
                <li><strong>DTI Ratio:</strong> Typically up to 45%</li>
                <li><strong>Best For:</strong> Good credit, larger down payments, removing PMI over time</li>
            </ul>

            <h2>Key Differences</h2>
            <p>The biggest practical differences come down to mortgage insurance and long-term cost. FHA loans have permanent mortgage insurance that can only be removed by refinancing. Conventional loans allow PMI removal once you reach 20% equity, which can save you hundreds per month over time.</p>
            <p>For borrowers with credit scores above 700 and at least 5% down, conventional loans are often the better long-term value. For those with lower scores or minimal savings, FHA loans provide an accessible path to homeownership.</p>

            <h2>Which Should You Choose?</h2>
            <p>The best choice depends on your unique situation. With Lumina, you don't have to choose blindly — our AI compares both options (and many more) across 50+ lenders to show you the most cost-effective path based on your actual financial profile.</p>
        `,
    },
    {
        slug: 'self-employed-mortgage-guide',
        title: 'Getting a Mortgage When You\'re Self-Employed: What You Need to Know',
        excerpt:
            'Self-employed borrowers face unique challenges in the mortgage process. Learn about bank statement loans, documentation requirements, and tips for approval.',
        category: 'Self-Employed',
        readTime: '7 min read',
        publishedAt: '2025-10-22',
        author: 'Lumina Team',
        coverGradient: 'from-[#162D4A] to-[#2563EB]',
        content: `
            <h2>The Self-Employed Mortgage Challenge</h2>
            <p>If you're self-employed, you know that your income doesn't fit neatly into a W-2 box. While this can make the mortgage process more complex, it certainly doesn't make it impossible. Millions of self-employed Americans successfully get mortgages every year.</p>

            <h2>Why It's Different for Self-Employed Borrowers</h2>
            <p>Traditional mortgage underwriting relies heavily on W-2s and pay stubs to verify income. Self-employed borrowers typically have variable income, business deductions that lower their taxable income, and more complex financial pictures. Lenders need to verify that your income is stable and sufficient to support mortgage payments.</p>

            <h2>Documentation You'll Need</h2>
            <ul>
                <li><strong>Tax Returns:</strong> Typically 2 years of personal and business tax returns</li>
                <li><strong>Profit & Loss Statements:</strong> Year-to-date P&L prepared by a CPA</li>
                <li><strong>Business License:</strong> Proof that your business is active and legitimate</li>
                <li><strong>Bank Statements:</strong> 12-24 months of personal and/or business bank statements</li>
                <li><strong>1099 Forms:</strong> If applicable, showing client payments</li>
            </ul>

            <h2>Bank Statement Loans: A Game-Changer</h2>
            <p>Bank statement loans are specifically designed for self-employed borrowers. Instead of using tax returns to verify income, lenders analyze 12-24 months of bank statements to calculate your qualifying income. This is particularly beneficial if you take significant business deductions that reduce your taxable income on paper.</p>
            <p>With bank statement loans, lenders typically look at your average monthly deposits and may use 50-100% of that amount as qualifying income, depending on the program.</p>

            <h2>Tips for Self-Employed Borrowers</h2>
            <ul>
                <li>Keep business and personal finances separate</li>
                <li>Maintain consistent bank deposits</li>
                <li>Work with a CPA to ensure clean financial records</li>
                <li>Consider timing your application after a strong income period</li>
                <li>Be prepared with more documentation than a W-2 employee</li>
                <li>Work with a broker (like Lumina) who has access to non-QM and bank statement loan programs</li>
            </ul>
        `,
    },
    {
        slug: 'va-loans-explained',
        title: 'VA Loans Explained: Benefits, Eligibility, and How to Apply',
        excerpt:
            'A comprehensive guide to VA home loans for veterans, active-duty service members, and eligible surviving spouses. Zero down payment and no PMI.',
        category: 'Loan Types',
        readTime: '6 min read',
        publishedAt: '2025-10-05',
        author: 'Lumina Team',
        coverGradient: 'from-[#0F172A] to-[#1E3A5F]',
        content: `
            <h2>What Is a VA Loan?</h2>
            <p>VA loans are mortgage loans guaranteed by the U.S. Department of Veterans Affairs. They're available to eligible veterans, active-duty service members, National Guard members, Reservists, and certain surviving spouses. VA loans are widely considered one of the best mortgage products available due to their exceptional benefits.</p>

            <h2>Key Benefits of VA Loans</h2>
            <ul>
                <li><strong>No Down Payment:</strong> VA loans offer 100% financing — no down payment required</li>
                <li><strong>No PMI:</strong> Unlike conventional and FHA loans, VA loans don't require private mortgage insurance</li>
                <li><strong>Competitive Rates:</strong> VA loan rates are typically lower than conventional rates</li>
                <li><strong>Flexible Credit:</strong> More lenient credit requirements than conventional loans</li>
                <li><strong>No Prepayment Penalty:</strong> Pay off your loan early without fees</li>
                <li><strong>Limited Closing Costs:</strong> VA limits the closing costs that veterans can be charged</li>
                <li><strong>Reusable Benefit:</strong> You can use your VA loan benefit multiple times</li>
            </ul>

            <h2>Eligibility Requirements</h2>
            <p>To be eligible for a VA loan, you generally need to meet one of these service requirements:</p>
            <ul>
                <li>90 consecutive days of active service during wartime</li>
                <li>181 days of active service during peacetime</li>
                <li>6 years in the National Guard or Reserves</li>
                <li>Spouse of a service member who died in the line of duty or from a service-connected disability</li>
            </ul>
            <p>You'll need a Certificate of Eligibility (COE) from the VA, which Lumina can help you obtain electronically during the application process.</p>

            <h2>The VA Funding Fee</h2>
            <p>While VA loans don't have PMI, most borrowers pay a one-time VA funding fee (typically 1.25-3.3% of the loan amount). This fee can be rolled into the loan. Some veterans are exempt from the funding fee, including those receiving VA disability compensation.</p>

            <h2>How to Apply</h2>
            <p>Applying for a VA loan through Lumina is straightforward. Our platform will verify your eligibility, help you obtain your COE, and match you with lenders offering the most competitive VA loan rates. The process is 100% digital and typically faster than traditional VA loan applications.</p>
        `,
    },
    {
        slug: 'mortgage-refinancing-when-and-why',
        title: 'Should You Refinance Your Mortgage? When It Makes Sense',
        excerpt:
            'Refinancing can save you thousands — or cost you money. Learn when refinancing makes financial sense and how to calculate your break-even point.',
        category: 'Refinance',
        readTime: '5 min read',
        publishedAt: '2025-09-18',
        author: 'Lumina Team',
        coverGradient: 'from-[#1E3A5F] to-[#60A5FA]',
        content: `
            <h2>What Is Mortgage Refinancing?</h2>
            <p>Refinancing means replacing your existing mortgage with a new one, typically to get a better interest rate, change your loan term, or access your home equity. It's essentially taking out a new loan to pay off your current one.</p>

            <h2>Types of Refinancing</h2>
            <ul>
                <li><strong>Rate-and-Term Refinance:</strong> Change your interest rate, loan term, or both. This is the most common type of refinance.</li>
                <li><strong>Cash-Out Refinance:</strong> Borrow more than you owe and receive the difference in cash. Useful for home improvements, debt consolidation, or major expenses.</li>
                <li><strong>Streamline Refinance:</strong> Simplified refinancing for FHA and VA loans with reduced documentation requirements.</li>
            </ul>

            <h2>When Does Refinancing Make Sense?</h2>
            <ul>
                <li><strong>Lower Interest Rate:</strong> A general rule is that refinancing makes sense if you can reduce your rate by at least 0.5-1%. But always calculate the break-even point.</li>
                <li><strong>Shorter Loan Term:</strong> Switching from a 30-year to a 15-year mortgage can save significant interest over the life of the loan.</li>
                <li><strong>Remove PMI:</strong> If your home has appreciated and you now have 20%+ equity, refinancing can eliminate PMI payments.</li>
                <li><strong>Cash-Out for Major Expenses:</strong> Using home equity for renovations, education, or debt consolidation can be more cost-effective than other borrowing options.</li>
                <li><strong>Switch from ARM to Fixed:</strong> If you have an adjustable-rate mortgage and want payment stability, refinancing to a fixed rate provides certainty.</li>
            </ul>

            <h2>Calculating Your Break-Even Point</h2>
            <p>Refinancing has costs (typically 2-5% of the loan amount). To determine if it's worthwhile, divide your total closing costs by your monthly savings. The result is the number of months until you break even. If you plan to stay in the home longer than the break-even period, refinancing likely makes sense.</p>
            <p><strong>Example:</strong> If refinancing costs $4,000 and saves you $200/month, your break-even point is 20 months. If you plan to stay for 5+ years, you'll save $8,000 after the break-even point.</p>
        `,
    },
    {
        slug: 'credit-score-mortgage-impact',
        title: 'How Your Credit Score Impacts Your Mortgage Rate and Approval',
        excerpt:
            'Your credit score is the single biggest factor in your mortgage rate. Learn how scores are calculated, what lenders look for, and how to improve yours.',
        category: 'Rates & Finance',
        readTime: '6 min read',
        publishedAt: '2025-09-01',
        author: 'Lumina Team',
        coverGradient: 'from-[#162D4A] to-[#3B82F6]',
        content: `
            <h2>Why Your Credit Score Matters</h2>
            <p>Your credit score is the single most influential factor in determining your mortgage interest rate. A higher score can save you tens of thousands of dollars over the life of a 30-year mortgage. Understanding how scores work and how to improve yours is one of the best financial investments you can make.</p>

            <h2>Credit Score Ranges and What They Mean</h2>
            <ul>
                <li><strong>760+ (Excellent):</strong> Qualifies for the best available rates</li>
                <li><strong>700-759 (Good):</strong> Slightly higher rates, still very competitive</li>
                <li><strong>660-699 (Fair):</strong> Higher rates, may have limited loan options</li>
                <li><strong>620-659 (Below Average):</strong> Higher rates, may need FHA loan</li>
                <li><strong>Below 620:</strong> Limited options, may need specialized programs</li>
            </ul>

            <h2>The Real Dollar Impact</h2>
            <p>On a $350,000 30-year mortgage, the difference between a 6.5% rate (good credit) and a 7.5% rate (fair credit) is approximately $250 per month — that's $90,000 over the life of the loan. Even a 0.25% rate improvement can save you $15,000-$20,000 in total interest.</p>

            <h2>How to Improve Your Credit Score</h2>
            <ul>
                <li><strong>Pay Bills on Time:</strong> Payment history is 35% of your score. Set up autopay for all accounts.</li>
                <li><strong>Reduce Credit Utilization:</strong> Keep credit card balances below 30% of your limits (below 10% is ideal).</li>
                <li><strong>Don't Close Old Accounts:</strong> Length of credit history matters. Keep old accounts open even if unused.</li>
                <li><strong>Limit New Applications:</strong> Each hard inquiry can temporarily lower your score by 5-10 points.</li>
                <li><strong>Check for Errors:</strong> Review your credit reports from all three bureaus (Equifax, Experian, TransUnion) and dispute any errors.</li>
                <li><strong>Become an Authorized User:</strong> Being added to a family member's old, well-managed credit card can boost your score.</li>
            </ul>

            <h2>Timeline for Improvement</h2>
            <p>Most credit score improvements take 30-90 days to reflect. If you're planning to buy a home in the next 6-12 months, start working on your credit now. Even small improvements can translate to significant savings on your mortgage.</p>
        `,
    },
    {
        slug: 'closing-costs-explained',
        title: 'Closing Costs Explained: What to Expect and How to Prepare',
        excerpt:
            'Closing costs can add thousands to your home purchase. Understand every fee, who pays what, and strategies to reduce your out-of-pocket costs.',
        category: 'Homebuying',
        readTime: '5 min read',
        publishedAt: '2025-08-15',
        author: 'Lumina Team',
        coverGradient: 'from-[#0F172A] to-[#2563EB]',
        content: `
            <h2>What Are Closing Costs?</h2>
            <p>Closing costs are the fees and expenses you pay when finalizing your mortgage, beyond the down payment. They typically range from 2-5% of the loan amount and are paid at the closing table (or sometimes rolled into the loan).</p>

            <h2>Common Closing Cost Items</h2>
            <ul>
                <li><strong>Loan Origination Fee:</strong> 0.5-1% of the loan amount, charged by the lender for processing your loan</li>
                <li><strong>Appraisal Fee:</strong> $400-$700 for a professional property valuation</li>
                <li><strong>Title Insurance:</strong> $500-$2,000 to protect against title defects</li>
                <li><strong>Title Search:</strong> $200-$400 to verify the property's ownership history</li>
                <li><strong>Attorney Fees:</strong> Varies by state, some states require an attorney at closing</li>
                <li><strong>Recording Fees:</strong> $50-$250 to record the deed with the county</li>
                <li><strong>Prepaid Items:</strong> Property taxes, homeowner's insurance, and prepaid interest</li>
                <li><strong>Escrow Deposits:</strong> Initial deposits for your tax and insurance escrow account</li>
                <li><strong>Credit Report Fee:</strong> $25-$50 per borrower</li>
                <li><strong>Flood Certification:</strong> $15-$25 to determine flood zone status</li>
            </ul>

            <h2>How to Reduce Closing Costs</h2>
            <ul>
                <li><strong>Shop Around:</strong> Compare Loan Estimates from multiple lenders (Lumina does this automatically)</li>
                <li><strong>Negotiate with the Seller:</strong> Ask for seller concessions to cover some or all closing costs</li>
                <li><strong>Look for No-Closing-Cost Options:</strong> Some lenders offer this in exchange for a slightly higher rate</li>
                <li><strong>Close at End of Month:</strong> This reduces the prepaid interest you owe at closing</li>
                <li><strong>Ask About Lender Credits:</strong> Some lenders offer credits that offset closing costs</li>
            </ul>

            <h2>The Loan Estimate</h2>
            <p>Within 3 business days of applying for a mortgage, you'll receive a Loan Estimate — a standardized document that breaks down all expected costs. Review it carefully and compare estimates from different lenders. With Lumina, you can easily compare these costs across multiple offers in your dashboard.</p>
        `,
    },
]

export function getArticleBySlug(slug: string): BlogArticle | undefined {
    return blogArticles.find((article) => article.slug === slug)
}

export function getRelatedArticles(currentSlug: string, limit = 3): BlogArticle[] {
    const current = getArticleBySlug(currentSlug)
    if (!current) return blogArticles.slice(0, limit)

    // Prefer same category, then most recent
    const sameCategory = blogArticles.filter(
        (a) => a.slug !== currentSlug && a.category === current.category
    )
    const others = blogArticles.filter(
        (a) => a.slug !== currentSlug && a.category !== current.category
    )
    return [...sameCategory, ...others].slice(0, limit)
}
