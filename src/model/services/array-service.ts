class ArrayService {
    fillWithDefault<T>(
        array: T[],
        defaultValue: T,
        desiredLength: number = 8
    ): T[] {
        while (array.length < desiredLength) {
            array.push(defaultValue)
        }
        return array
    }
}

const arrayService = new ArrayService()
export default arrayService
