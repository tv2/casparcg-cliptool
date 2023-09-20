import { ReduxSettingsService } from '../../../shared/services/redux-settings-service'
import { reduxStore, state } from '../../../shared/store'
import { setGenerics } from '../../../shared/actions/settings-action'

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
    private view: BrowserSelectedView
    private readonly reduxSettingsService: ReduxSettingsService

    constructor() {
        this.reduxSettingsService = new ReduxSettingsService()
        const search = new URLSearchParams(window.location.search)
        this.view = this.getCurrentSelectedView(search)
        this.temporarilyEnsureSufficientOutputSettingsExist()
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

    /**
     * @remarks
     * The Redux state is only initialized with 1 output settings, which causes issues for channel view above 1.
     * Ones finished connecting to the backend, the actual settings will have been received.
     * Until then simply set the redux state to contain default settings, with entries matching the channel number.
     * @private
     */
    private temporarilyEnsureSufficientOutputSettingsExist() {
        if (
            !this.isChannelView() ||
            this.reduxSettingsService.getAllOutputSettings(state.settings)
                .length >= this.view.channel
        ) {
            return
        }
        reduxStore.dispatch(
            setGenerics(
                this.reduxSettingsService.getDefaultGenericSettings(
                    this.view.channel
                )
            )
        )
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
