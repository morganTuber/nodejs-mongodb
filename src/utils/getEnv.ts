export const getEnv = (name: string): string => {
    const value = process.env[name]

    if (!value) {
        throw new Error(`${name} not found in environment variables`)
    }
    return value
}
