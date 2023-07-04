import { z } from 'zod'
import { UtilityService } from '../services/utility-service'

enum OperationModeSnapshot {
    CONTROL = 'control',
    EDIT_VISIBILITY = 'edit_visibility',
}
// Schema for Cliptool version 2.14 and below.
export const PreviousGenericSettings = z.object({
    transitionTime: z.number().default(16),
    ccgIp: z.string().default('0.0.0.0'),
    ccgAmcpPort: z.number().default(5250),
    ccgDefaultLayer: z.number().default(10),
    ccgOscPort: z.number().default(5253),
    outputLabels: z
        .string()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(transform, '')
        ),
    outputFolders: z
        .string()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(transform, '')
        ),
    scale: z
        .boolean()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                false
            )
        ),
    scaleX: z
        .number()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                1920
            )
        ),
    scaleY: z
        .number()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                1080
            )
        ),
    webURL: z
        .string()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(transform, '')
        ),
    startupLoopState: z
        .boolean()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                false
            )
        ),
    startupMixState: z
        .boolean()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                false
            )
        ),
    startupManualstartState: z
        .boolean()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                false
            )
        ),
    startupWebState: z
        .boolean()
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                false
            )
        ),
    startupOperationMode: z
        .nativeEnum(OperationModeSnapshot)
        .array()
        .transform((transform) =>
            new UtilityService().expandArrayWithDefaultsIfNeeded(
                transform,
                OperationModeSnapshot.CONTROL
            )
        ),
})
export type PreviousGenericSettings = z.infer<typeof PreviousGenericSettings>
