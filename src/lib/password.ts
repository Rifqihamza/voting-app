import bcrypt from "bcryptjs"

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
}

/**
 * Check if password meets security requirements
 * @param password - Password to validate
 * @returns Object with isValid and errors array
 */
export function validatePassword(password: string): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []

    // Minimum length
    if (password.length < 8) {
        errors.push("Password minimal 8 karakter")
    }

    // Maximum length
    if (password.length > 128) {
        errors.push("Password maksimal 128 karakter")
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push("Password harus mengandung minimal 1 huruf besar")
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push("Password harus mengandung minimal 1 huruf kecil")
    }

    // At least one number
    if (!/[0-9]/.test(password)) {
        errors.push("Password harus mengandung minimal 1 angka")
    }

    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password harus mengandung minimal 1 karakter spesial")
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

/**
 * Generate a random password
 * @param length - Length of password (default: 16)
 * @returns Random secure password
 */
export function generatePassword(length: number = 16): string {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const allChars = uppercase + lowercase + numbers + special

    let password = ""

    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
}