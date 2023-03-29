// TODO: Come up with a better name.
class EventService {
    getTextFromEvent(event: React.ChangeEvent<HTMLInputElement>): string {
        return event.target.value
    }

    getNumberFromEvent(event: React.ChangeEvent<HTMLInputElement>): number {
        return Number(event.target.value)
    }

    getCheckedFromEvent(event: React.ChangeEvent<HTMLInputElement>): boolean {
        return event.target.checked
    }
}

const eventService = new EventService()
export default eventService
