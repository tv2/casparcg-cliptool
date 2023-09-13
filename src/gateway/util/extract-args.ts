import { logger } from './logger-gateway'

function extractArgument(argumentName: string): string | undefined {
    const extracted: string | undefined = process.argv.find((argument) =>
        argument.includes(argumentName)
    )
    if (!extracted) return undefined
    return extracted.split('=')[1]
}

export interface Arguments {
    clipToolHost: string
    type: string
    oscPort: string
}
//Runtime args:
export const ARG_CONSTANTS: Arguments = {
    clipToolHost: extractArgument('cliptool') || 'http://0.0.0.0:5555',
    type: extractArgument('type') || '',
    oscPort: extractArgument('oscport') || '5256',
}

export function argHelp(): void {
    logger.info(`Runtime arguments are:
----------------------------------------------------------------
cliptool=hostname:port - adress of the clipttol server

----------------------------------------------------------------
type=osc for OSC gateway
oscport=5256 - port when running gateway as OSC server

----------------------------------------------------------------
type=amp for AMP gateway
Creates an AMP server at port 3811

----------------------------------------------------------------
`)
}
