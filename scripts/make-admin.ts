import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    if (!email) {
        console.error('Please provide an email address')
        process.exit(1)
    }

    console.log(`Looking for user with email: ${email}`)

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Try to find in Profile
            const profile = await prisma.profile.findFirst({
                where: { email }
            })

            if (!profile) {
                console.error('User not found in User or Profile tables. Please sign up first.')
                process.exit(1)
            }

            console.log(`Found Profile: ${profile.id}`)
            await prisma.profile.update({
                where: { id: profile.id },
                data: { isAdmin: true }
            })
            console.log(`✅ Updated Profile ${email} to Admin`)
            return
        }

        console.log(`Found User: ${user.id}`)
        await prisma.user.update({
            where: { id: user.id },
            data: { isAdmin: true }
        })

        // Also update Profile if exists
        const profile = await prisma.profile.findFirst({ where: { email } })
        if (profile) {
            await prisma.profile.update({
                where: { id: profile.id },
                data: { isAdmin: true }
            })
        }

        console.log(`✅ Updated User ${email} to Admin`)

    } catch (error) {
        console.error('Error updating user:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
