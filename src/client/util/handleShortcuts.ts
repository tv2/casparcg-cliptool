import { reduxState } from '../../model/reducers/store'

class HandleShortcuts {
    ccgLoadPlay: any
    constructor(ccgLoadPlay: any) {
        this.ccgLoadPlay = ccgLoadPlay

        //Setup Keyboard shortcuts:
        document.addEventListener('keydown', this._handleKeyDown.bind(this))
    }

    //Shortcut for mix and take
    _handleKeyDown(event: any) {
        //Corresponding output for QWER shortcut:
        const keyTuple = { Q: 1, W: 2, E: 3, R: 4 }
        //Convert event.keyCode to letter:
        let keyPressed = String.fromCharCode(event.keyCode)

        if (reduxState.appNav.showSettingsActive) {
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

export default HandleShortcuts
