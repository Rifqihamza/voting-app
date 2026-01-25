import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { nis: 'admin001' },
        update: {},
        create: {
            nis: 'admin001',
            name: 'Administrator',
            password: adminPassword,
            kelas: 'Admin',
            role: 'ADMIN',
            isActive: true,
        },
    })
    console.log('✅ Admin user created:', admin.name)

    // Create Sample Classes
    const classes = ['10A', '10B', '11A', '11B', '12A', '12B']

    // Create Student Users
    const students = []
    for (let i = 0; i < 100; i++) {
        const classIndex = Math.floor(i / 17) // Distribute students across classes
        const className = classes[classIndex] || classes[0]

        const studentPassword = await bcrypt.hash(`student${i + 1}`, 12)
        const student = await prisma.user.upsert({
            where: { nis: `student${String(i + 1).padStart(3, '0')}` },
            update: {},
            create: {
                nis: `student${String(i + 1).padStart(3, '0')}`,
                name: `Student ${i + 1}`,
                password: studentPassword,
                kelas: className,
                role: 'STUDENT',
                isActive: true,
            },
        })
        students.push(student)
    }
    console.log('✅ Created 100 student users')

    // Create Sample Elections
    const elections = []
    const electionTitles = [
        'Pemilihan Ketua & Wakil Ketua OSIS 2024',
    ]

    for (let i = 0; i < 3; i++) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + (i * 30)) // Spread elections over time

        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 7) // 7 days duration

        // Check if election already exists
        let election = await prisma.election.findFirst({
            where: { title: electionTitles[i] }
        })

        if (!election) {
            election = await prisma.election.create({
                data: {
                    title: electionTitles[i],
                    description: `Pemilihan untuk mengisi jabatan ${electionTitles[i].split(' ')[1]} OSIS periode 2024-2025`,
                    startAt: startDate,
                    endAt: endDate,
                    isPublished: i === 0, // Only first election is active
                },
            })
        }
        elections.push(election)
    }
    console.log('✅ Created 3 sample elections')

    // Create Candidates for each election
    const candidateNames = [
        { ketua: 'Ahmad Rahman', wakil: 'Siti Nurhaliza' },
        { ketua: 'Budi Santoso', wakil: 'Maya Sari' },
        { ketua: 'Citra Dewi', wakil: 'Dian Purnama' },
        { ketua: 'Eko Prasetyo', wakil: 'Fitri Handayani' },
        { ketua: 'Gilang Ramadhan', wakil: 'Hana Maulida' },
        { ketua: 'Indra Wijaya', wakil: 'Jasmine Putri' },
    ]

    const candidates = []
    for (const election of elections) {
        // Create 3-4 candidates per election
        const numCandidates = Math.floor(Math.random() * 2) + 3

        for (let i = 0; i < numCandidates; i++) {
            const candidateData = candidateNames[i]

            // Check if candidate already exists for this election
            let candidate = await prisma.candidate.findFirst({
                where: {
                    electionId: election.id,
                    nameKetua: candidateData.ketua
                }
            })

            if (!candidate) {
                candidate = await prisma.candidate.create({
                    data: {
                        electionId: election.id,
                        nameKetua: candidateData.ketua,
                        nameWakil: candidateData.wakil,
                        visi: `Visi kandidat ${candidateData.ketua}: Membawa perubahan positif untuk sekolah dengan fokus pada ${['akademik', 'ekstrakurikuler', 'kesejahteraan siswa', 'inovasi teknologi'][i % 4]}`,
                        misi: `1. Meningkatkan kualitas pendidikan\n2. Mengembangkan potensi siswa\n3. Mempererat solidaritas antar siswa\n4. Membawa sekolah menuju kemajuan`,
                        foto: `/uploads/candidate-${i + 1}.jpg`,
                        isActive: true,
                    },
                })
            }
            candidates.push(candidate)
        }
    }
    console.log('✅ Created candidates for elections')

    // Create Votes for active election
    const activeElection = elections.find(e => e.isPublished)
    if (activeElection) {
        const activeCandidates = candidates.filter(c => c.electionId === activeElection.id)

        // Randomly assign votes to students for active election
        const studentsToVote = students.slice(0, Math.floor(students.length * 0.7)) // 70% participation

        for (const student of studentsToVote) {
            // Check if student already voted in this election
            const existingVote = await prisma.vote.findFirst({
                where: {
                    userId: student.id,
                    electionId: activeElection.id,
                },
            })

            if (!existingVote) {
                // Randomly select a candidate
                const randomCandidate = activeCandidates[Math.floor(Math.random() * activeCandidates.length)]

                await prisma.vote.create({
                    data: {
                        userId: student.id,
                        candidateId: randomCandidate.id,
                        electionId: activeElection.id,
                    },
                })
            }
        }
        console.log('✅ Created votes for active election')
    }

    // Create some login history
    for (let i = 0; i < 20; i++) {
        const randomStudent = students[Math.floor(Math.random() * students.length)]
        await prisma.loginHistory.create({
            data: {
                userId: randomStudent.id,
                success: Math.random() > 0.1, // 90% success rate
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        })
    }
    console.log('✅ Created login history')

    console.log('🎉 Database seeding completed!')
    console.log('\n📋 Login Credentials:')
    console.log('Admin: admin001 / admin123')
    console.log('Students: student001 to student100 / student1 to student100')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })