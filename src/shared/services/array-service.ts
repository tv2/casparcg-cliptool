class ArrayService {
    fillWithDefault<T>(
        array: T[],
        defaultValue: T,
        desiredLength: number = 8
    ): T[] {
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
}

const arrayService = new ArrayService()
export default arrayService
