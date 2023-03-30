class JsxService {
    decideJsx(
        predicate: boolean,
        elementWhenTrue: JSX.Element,
        elementWhenFalse: JSX.Element
    ): JSX.Element {
        return predicate ? elementWhenTrue : elementWhenFalse
    }
}

const jsxService = new JsxService()
export default jsxService
