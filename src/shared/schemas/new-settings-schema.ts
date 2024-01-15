import { z } from 'zod'
import {
    CasparcgSettings,
    OperationMode,
    OutputSettings,
} from '../models/settings-models'

export const defaultOutputSettingsState: OutputSettings = {
    label: '',
    folder: '',
    shouldScale: false,
    scaleX: 1920,
    scaleY: 1080,
    loopState: false,
    mixState: false,
    manualStartState: false,
    webState: false,
    webUrl: '',
    operationMode: OperationMode.CONTROL,
    selectedFileName: '',
    cuedFileName: '',
    initialLoopState: false,
    initialMixState: false,
    initialManualStartState: false,
    initialWebState: false,
}

export const defaultCcgSettingsState: CasparcgSettings = {
    transitionTime: 16,
    ip: '0.0.0.0',
    amcpPort: 5250,
    defaultLayer: 10,
    oscPort: 5253,
}

const operationModeSchema = z.nativeEnum(OperationMode)

const outputSettingsSchema = z.object({
    label: z.string(),
    folder: z.string(),
    shouldScale: z.boolean(),
    scaleX: z.number(),
    scaleY: z.number(),
    webUrl: z.string(),
    loopState: z.boolean(),
    mixState: z.boolean(),
    manualStartState: z.boolean(),
    webState: z.boolean(),
    operationMode: operationModeSchema,
    selectedFileName: z.string(),
    cuedFileName: z.string(),
    initialLoopState: z.boolean().optional(),
    initialMixState: z.boolean().optional(),
    initialManualStartState: z.boolean().optional(),
    initialWebState: z.boolean().optional(),
})

const ccgSettingsSchema = z.object({
    transitionTime: z.number(),
    ip: z.string(),
    amcpPort: z.number(),
    defaultLayer: z.number(),
    oscPort: z.number(),
})

// Schema for Cliptool version 2.15 and above.
export const newGenericSettingsSchema = z.object({
    ccgSettings: ccgSettingsSchema,
    outputSettings: z.array(outputSettingsSchema),
})
