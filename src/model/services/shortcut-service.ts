import { state } from '../reducers/store'

// Unused currently, but Kasper says use of the original 'handleShortcuts', should be re-implemented in the future.
// Because of this, the code is being kept - now as a service on the model level, to eliminate duplication.
class ShortcutService {
    ccgLoadPlay: any
    constructor(ccgLoadPlay: any) {
        this.ccgLoadPlay = ccgLoadPlay

        //Setup Keyboard shortcuts:
        document.addEventListener('keydown', this.processKeyDown.bind(this))
    }

    //Shortcut for mix and take
    private processKeyDown(event: any) {
        //Corresponding output for QWER shortcut:
        const keyTuple = { Q: 1, W: 2, E: 3, R: 4 }
        //Convert event.keyCode to letter:
        let keyPressed = String.fromCharCode(event.keyCode)

        if (state.appNavigation.isSettingsVisible) {
            keyPressed = ''
        }

        switch (keyPressed) {
            case '1':
            case '2':
            case '3':
            case '4':
                this.ccgLoadPlay.pvwPlay(
                    parseInt(String.fromCharCode(event.keyCode))
                )
                break
            case 'Q':
            case 'W':
            case 'E':
            case 'R':
                console.log('Play output : ', keyTuple[keyPressed])
                this.ccgLoadPlay.pgmPlay(keyTuple[keyPressed])
                break
            default:
                break
        }
    }
}

export default ShortcutService
