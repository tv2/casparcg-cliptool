import { logger } from './loggerGateway'

function extractArg(argName: string): string | undefined {
    let extracted = process.argv.find((arg) => {
        return arg.includes(argName)
    })
    if (!extracted) return undefined
    return extracted.split('=')[1]
}

export interface IArgConstants {
    clipToolHost: string
    type: string
    oscPort: string
}
//Runtime args:
export const ARG_CONSTANTS: IArgConstants = {
    clipToolHost: extractArg('cliptool') || 'http://0.0.0.0:5555',
    type: extractArg('type') || '',
    oscPort: extractArg('oscport') || '5256',
}

export function argHelp(): void {
    logger.info(`Runtime arguments are:
----------------------------------------------------------------
cliptool='hostname:port' - adress of the clipttol server

----------------------------------------------------------------
type='osc' for OSC gateway
oscport='5256' - port when running gateway as OSC server

----------------------------------------------------------------
type='amp' for AMP gateway
Creates an AMP server at port 3811

----------------------------------------------------------------
`)
}
