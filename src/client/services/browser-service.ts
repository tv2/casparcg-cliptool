enum SelectedView {
    ORDINARY = 'ordinary',
    TEXT = 'textview',
    CHANNEL = 'channel',
    TEXT_CHANNEL = 'text-channel-view',
}

interface BrowserSelectedView {
    selected: SelectedView
    channel: number
}

class BrowserService {
    private view: BrowserSelectedView

    constructor(searchQuery: string) {
        const search = new URLSearchParams(searchQuery)
        if (search.has(SelectedView.TEXT)) {
            if (search.has(SelectedView.CHANNEL)) {
                const channel = search.get(SelectedView.CHANNEL)
                const specificChannel = channel
                    ? Math.max(parseInt(channel), 1)
                    : 1
                this.view = {
                    selected: SelectedView.TEXT_CHANNEL,
                    channel: specificChannel,
                }
            } else {
                this.view = {
                    selected: SelectedView.TEXT,
                    channel: 0,
                }
            }
        } else if (search.has(SelectedView.CHANNEL)) {
            const channel = search.get(SelectedView.CHANNEL)
            const specificChannel = channel ? Math.max(parseInt(channel), 1) : 1
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
        return (
            this.view.selected === SelectedView.TEXT ||
            this.view.selected == SelectedView.TEXT_CHANNEL
        )
    }

    public isChannelView(): boolean {
        return (
            this.view.selected === SelectedView.CHANNEL ||
            this.view.selected == SelectedView.TEXT_CHANNEL
        )
    }

    public getChannel(): number {
        return this.view.channel - 1
    }
}

const browserService: BrowserService = new BrowserService(
    window.location.search
)
export default browserService
