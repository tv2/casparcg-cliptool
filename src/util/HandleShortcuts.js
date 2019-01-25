class HandleShortcuts {
    constructor(ccgLoadPlay) {
        this.ccgLoadPlay = ccgLoadPlay;
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
        //Setup Keyboard shortcuts:
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    //Shortcut for mix and take
    _handleKeyDown(event) {

        const keyTuple = {
            Q: 1,
            W: 2,
            E: 3,
            R: 4
        };

        //Only Assign Active Tab to shortcut:
        //key 1-4
        const pvwPlay = JSON.stringify(this.store.appNavReducer[0].appNav.activeTab+1).charCodeAt(0);
        //key: QWER:
        const pgmPlay = ["Q", "W", "E", "R"][this.store.appNavReducer[0].appNav.activeTab].charCodeAt(0);

        switch( event.keyCode ) {
            case pvwPlay:
                this.ccgLoadPlay.pvwPlay(parseInt(String.fromCharCode(event.keyCode)));
                break;
            case pgmPlay:
                console.log("Play output : ", keyTuple[String.fromCharCode(event.keyCode)]);
                this.ccgLoadPlay.pgmPlay(keyTuple[String.fromCharCode(event.keyCode)]);
                break;
            default:
                break;
        }
    }

}

export default HandleShortcuts;
