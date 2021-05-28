import { logger } from './loggerGateway'

const extractArg = (argName: string): string | undefined => {
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

export const argHelp = () => {
    logger.info(`Runtime arguments are : `)
    logger.info(
        `----------------------------------------------------------------`
    )
    logger.info(`cliptool='hostname:port' - adress of the clipttol server `)
    logger.info(
        `----------------------------------------------------------------`
    )
    logger.info(`type='osc' for OSC gateway`)
    logger.info(`oscport='5256' - port when running gateway as OSC server`)
    logger.info(
        `----------------------------------------------------------------`
    )
    logger.info(`type='amp' for AMP gateway`)
    logger.info(`Creates an AMP server at port 3811`)
    logger.info(
        `----------------------------------------------------------------`
    )
    logger.info(``)
    logger.info(``)
}
