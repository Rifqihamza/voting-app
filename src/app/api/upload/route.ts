import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { auth } from "@/lib/auth"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "Tidak ada file yang dikirim" }, { status: 400 })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File terlalu besar (maksimal 5MB)" }, { status: 400 })
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 })
        }

        // Sanitize filename
        const originalName = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9]/g, '_')
        const fileExt = path.extname(file.name).toLowerCase()
        const fileName = `${Date.now()}-${originalName}${fileExt}`
        const uploadDir = path.join(process.cwd(), "public", "uploads")
        await fs.mkdir(uploadDir, { recursive: true })

        const filePath = path.join(uploadDir, fileName)

        // Save file
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(filePath, buffer)

        const fileUrl = `/uploads/${fileName}`

        return NextResponse.json({ url: fileUrl })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Gagal mengupload file" }, { status: 500 })
    }
}
