import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = path.join(process.cwd(), "public", "uploads")
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
        const filePath = path.join(uploadDir, fileName)

        await writeFile(filePath, buffer)

        const fileUrl = `/uploads/${fileName}`

        return NextResponse.json({ url: fileUrl })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Upload gagal" }, { status: 500 })
    }
}
