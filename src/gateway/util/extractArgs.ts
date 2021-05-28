import { info } from 'winston'

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
    console.log(`Runtime arguments are : `)
    console.log(
        `----------------------------------------------------------------`
    )
    console.log(`cliptool='hostname:port' - adress of the clipttol server `)
    console.log(
        `----------------------------------------------------------------`
    )
    console.log(`type='osc' for OSC gateway`)
    console.log(`oscport='5256' - port when running gateway as OSC server`)
    console.log(
        `----------------------------------------------------------------`
    )
    console.log(`type='amp' for AMP gateway`)
    console.log(`Creates an AMP server at port 3811`)
    console.log(
        `----------------------------------------------------------------`
    )
    console.log(``)
    console.log(``)
}
