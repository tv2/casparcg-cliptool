const DEFAULT_NODE_ENV = 'production'

export function loadBundledEnvironment(): void {
    if (!isInBundledEnvironment()) {
        return
    }

    process.env.NODE_ENV = process.env.NODE_ENV ?? DEFAULT_NODE_ENV
}

function isInBundledEnvironment(): boolean {
    return 'pkg' in process
}
