class HandleShortcuts {
    constructor(ccgLoadPlay) {
        this.ccgLoadPlay = ccgLoadPlay;

        this.store = window.store.getState();
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
        //Setup Keyboard shortcuts:
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    //Shortcut for mix and take
    _handleKeyDown(event) {
        //Corresponding output for QWER shortcut:
        const keyTuple = {Q: 1, W: 2, E: 3, R: 4};

        //Only Allow Active Tab to shortcut:
        //key: 1-4
        const pvwPlay = JSON.stringify(this.store.appNav[0].activeTab+1).charCodeAt(0);
        //key: QWER:
        const pgmPlay = ["Q", "W", "E", "R"][this.store.appNav[0].activeTab].charCodeAt(0);

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
