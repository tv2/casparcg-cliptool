const FPS = 25

export const secondsToTimeCode = (timer: [number, number] = [0, 0]) => {
    let time = timer[1] - timer[0]
    if (time <= 0) {
        time = 0
    }
    if (time) {
        var hour = ('0' + Math.round(time / (60 * 60))).slice(-2)
        var minute = ('0' + Math.round(time / 60)).slice(-2)
        var sec = ('0' + Math.round(time % 60)).slice(-2)
        var frm = (
            '0' +
            (100 * (time - parseInt(String(time))) * (FPS / 100)).toFixed()
        ).slice(-2)
        return ' ' + hour + '.' + minute + '.' + sec + '.' + frm + ' '
    } else {
        return ' SELECTED '
    }
}
