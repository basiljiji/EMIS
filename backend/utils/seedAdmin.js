import Admin from "../models/adminModel.js"

export default async function seedAdminIfMissing() {
    const username = process.env.ADMIN_USERNAME
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const role = process.env.ADMIN_ROLE || "admin"

    if (!username || !email || !password) {
        console.warn("ADMIN seed skipped: missing ADMIN_USERNAME, ADMIN_EMAIL or ADMIN_PASSWORD in environment.")
        return
    }

    const existing = await Admin.findOne({ email })
    if (existing) {
        return
    }

    await Admin.create({ username, email, password, role })
}


