import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    const clerkId = process.argv[3] // Optional ID for creation

    if (!email) {
        console.error('Usage: npx tsx scripts/make-admin.ts <email> [clerk_user_id]')
        process.exit(1)
    }

    console.log(`Looking for user with email: ${email}`)

    try {
        // 1. Try to find existing Profile
        let profile = await prisma.profile.findFirst({
            where: { email }
        })

        if (!profile) {
            console.log(`Profile not found for ${email}.`)

            if (clerkId) {
                console.log(`Creating new Profile with ID: ${clerkId}`)
                profile = await prisma.profile.create({
                    data: {
                        id: clerkId, // Clerk ID (String)
                        email: email,
                        isAdmin: true,
                        fullName: 'Admin User',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                })
                console.log(`✅ Created Admin Profile: ${profile.id}`)
                return
            } else {
                console.error('Profile not found and no Clerk ID provided to create one.')
                console.error('Please provide Clerk User ID as second argument to create the profile.')
                process.exit(1)
            }
        }

        // 2. Profile exists, update it
        console.log(`Found Profile: ${profile.id}`)
        await prisma.profile.update({
            where: { id: profile.id },
            data: { isAdmin: true }
        })
        console.log(`✅ Updated Profile ${email} to Admin`)

    } catch (error) {
        console.error('Error updating user:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
