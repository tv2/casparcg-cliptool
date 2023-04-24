enum SelectedView {
    ORDINARY = 'ordinary',
    TEXT = 'textview',
    CHANNEL = 'channel',
}

interface BrowserSelectedView {
    selected: SelectedView
    channel: number
}

class BrowserService {
    private view: BrowserSelectedView

    constructor() {
        const search = new URLSearchParams(window.location.search)
        if (search.has(SelectedView.TEXT)) {
            this.view = {
                selected: SelectedView.TEXT,
                channel: 0,
            }
        } else if (search.has(SelectedView.CHANNEL)) {
            const channel = search.get(SelectedView.CHANNEL)
            const specificChannel = channel ? parseInt(channel) || 0 : 0
            this.view = {
                selected: SelectedView.CHANNEL,
                channel: specificChannel,
            }
        } else {
            this.view = {
                selected: SelectedView.ORDINARY,
                channel: 0,
            }
        }
    }
    public isOrdinaryView(): boolean {
        return this.view.selected === SelectedView.ORDINARY
    }
    public isTextView(): boolean {
        return this.view.selected === SelectedView.TEXT
    }
    public isChannelView(): boolean {
        return this.view.selected === SelectedView.CHANNEL
    }
    public getChannel(): number {
        return this.view.channel - 1
    }
}

const browserService: BrowserService = new BrowserService()
export default browserService
