import { z } from 'zod'
import { OperationMode, OutputSettings } from '../reducers/settingsModels'
import arrayService from '../services/array-service'

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
    selectedFile: '',
}

const operationModeSchema = z.nativeEnum(OperationMode)

const outputSettingsSchema = z.object({
    label: z.string().default(''),
    folder: z.string().default(''),
    shouldScale: z.boolean().default(false),
    scaleX: z.number().default(1920),
    scaleY: z.number().default(1080),
    webUrl: z.string().default(''),
    loopState: z.boolean().default(false),
    mixState: z.boolean().default(false),
    manualStartState: z.boolean().default(false),
    webState: z.boolean().default(false),
    operationMode: operationModeSchema.default(OperationMode.CONTROL),
    selectedFile: z.string().default(''),
})

const ccgSettingsSchema = z.object({
    transitionTime: z.number().default(16),
    ip: z.string().default('0.0.0.0'),
    amcpPort: z.number().default(5250),
    defaultLayer: z.number().default(10),
    oscPort: z.number().default(5253),
})

// Schema for Cliptool version 2.15 and above.
export const NewGenericSettings = z.object({
    ccgSettings: ccgSettingsSchema,
    outputSettings: z
        .array(outputSettingsSchema)
        .default(arrayService.fillWithDefault([], defaultOutputSettingsState))
        .transform((transform) =>
            arrayService.fillWithDefault(transform, defaultOutputSettingsState)
        ),
})
