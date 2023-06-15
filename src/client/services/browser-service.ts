enum SelectedView {
    THUMBNAIL = 'thumbnail',
    TEXT = 'textview',
    CHANNEL = 'channel',
    TEXT_CHANNEL = 'text-channel-view',
}

interface BrowserSelectedView {
    selected: SelectedView
    channel: number
}

export class BrowserService {
    static readonly instance = new BrowserService(window.location.search)
    private view: BrowserSelectedView

    constructor(searchQuery: string) {
        const search = new URLSearchParams(searchQuery)
        this.view = this.getCurrentSelectedView(search)
    }

    private getCurrentSelectedView(
        search: URLSearchParams
    ): BrowserSelectedView {
        if (search.has(SelectedView.TEXT) && search.has(SelectedView.CHANNEL)) {
            return {
                selected: SelectedView.TEXT_CHANNEL,
                channel: this.getQueryChannel(search),
            }
        }

        if (search.has(SelectedView.TEXT)) {
            return {
                selected: SelectedView.TEXT,
                channel: 0,
            }
        }

        if (search.has(SelectedView.CHANNEL)) {
            return {
                selected: SelectedView.CHANNEL,
                channel: this.getQueryChannel(search),
            }
        }

        return {
            selected: SelectedView.THUMBNAIL,
            channel: 0,
        }
    }

    private getQueryChannel(search: URLSearchParams): number {
        const channel = search.get(SelectedView.CHANNEL)
        return channel ? Math.max(parseInt(channel), 1) : 1
    }

    public isThumbnailView(): boolean {
        return this.view.selected === SelectedView.THUMBNAIL
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
