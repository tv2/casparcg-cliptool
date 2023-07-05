/**
 * Class for utility functions.
 */
export class UtilityService {
    expandArrayWithDefaultsIfNeeded<T>(
        array: T[],
        defaultValue: T,
        desiredLength: number = 8
    ): T[] {
        if (array.length >= desiredLength) {
            return array
        }

        while (array.length < desiredLength) {
            if (Array.isArray(defaultValue)) {
                array.push([...defaultValue] as T)
            } else if (typeof defaultValue === 'object') {
                array.push({ ...defaultValue })
            } else {
                array.push(defaultValue)
            }
        }
        return array
    }

    convertScreamingSnakeCaseToPascalCase(toBeConverted: string) {
        return toBeConverted
            .split('_')
            .map(
                (substr) =>
                    substr.toLowerCase().charAt(0).toUpperCase() +
                    substr.slice(1).toLowerCase()
            )
            .join(' ')
    }

    convertPascasCaseToScreamingSnakeCase(toBeConverted: string) {
        return toBeConverted.toUpperCase().replace(' ', '_')
    }
}
