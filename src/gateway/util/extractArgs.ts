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
    type: extractArg('type') || 'osc',
    oscPort: extractArg('oscport') || '5256',
}

export const argHelper = () => {
    console.log(`Runtime arguments are : `)
    console.log(`cliptool='hostname:port' - adress of the clipttol server `)
    console.log(`type='osc' | 'amp'  -btype of gateway`)
    console.log(`oscport='5256' - port when running gateway as OSC server`)
    console.log(``)
    console.log(``)
}
