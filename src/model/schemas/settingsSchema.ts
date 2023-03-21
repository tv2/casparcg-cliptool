import { z } from 'zod'
import { OperationMode, OutputSettings } from '../reducers/settingsModels'

// const validateSchemaType: <T>(obj: T) => void = <T>(obj: T) => {}
enum OperationModeSnapshot {
    CONTROL = 'control',
    EDIT_VISIBILITY = 'edit_visibility',
}

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

export const PreviousGenericSettings = z.object({
    transitionTime: z.number().default(16),
    ccgIp: z.string().default('0.0.0.0'),
    ccgAmcpPort: z.number().default(5250),
    ccgDefaultLayer: z.number().default(10),
    ccgOscPort: z.number().default(5253),
    outputLabels: z
        .string()
        .array()
        .transform((transform) => fillWithDefault(transform, '')),
    outputFolders: z
        .string()
        .array()
        .transform((transform) => fillWithDefault(transform, '')),
    scale: z
        .boolean()
        .array()
        .transform((transform) => fillWithDefault(transform, false)),
    scaleX: z
        .number()
        .array()
        .transform((transform) => fillWithDefault(transform, 1920)),
    scaleY: z
        .number()
        .array()
        .transform((transform) => fillWithDefault(transform, 1080)),
    webURL: z
        .string()
        .array()
        .transform((transform) => fillWithDefault(transform, '')),
    startupLoopState: z
        .boolean()
        .array()
        .transform((transform) => fillWithDefault(transform, false)),
    startupMixState: z
        .boolean()
        .array()
        .transform((transform) => fillWithDefault(transform, false)),
    startupManualStartState: z
        .boolean()
        .array()
        .transform((transform) => fillWithDefault(transform, false)),
    startupWebState: z
        .boolean()
        .array()
        .transform((transform) => fillWithDefault(transform, false)),
    startupOperationMode: z
        .nativeEnum(OperationModeSnapshot)
        .array()
        .transform((transform) =>
            fillWithDefault(transform, OperationModeSnapshot.CONTROL)
        ),
})
export type PreviousGenericSettings = z.infer<typeof PreviousGenericSettings>

export const NewGenericSettings = z.object({
    transitionTime: z.number().default(16),
    ccgIp: z.string().default('0.0.0.0'),
    ccgAmcpPort: z.number().default(5250),
    ccgDefaultLayer: z.number().default(10),
    ccgOscPort: z.number().default(5253),
    outputs: z
        .object({
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
            selectedFile: z.string().default(''),
            operationMode: z
                .nativeEnum(OperationMode)
                .default(OperationMode.CONTROL),
        })
        .array()
        .default(fillWithDefault([], defaultOutputSettingsState))
        .transform((transform) =>
            fillWithDefault(transform, defaultOutputSettingsState)
        ),
})
// Following line says that all attributes are optional, then though the '.required' has been used.
//validateSchemaType<GenericSettings>({} as z.infer<typeof NewGenericSettings>)

function fillWithDefault<T>(
    array: T[],
    defaultValue: T,
    desiredLength: number = 8
): T[] {
    while (array.length < desiredLength) {
        array.push(defaultValue)
    }
    return array
}
