
const FPS = 25;

export const secondsToTimeCode = (time => {
    if (time) {
        var hour = ('0' + parseInt(time/(60*60))).slice(-2);
        var minute = ('0' + parseInt(time/(60))).slice(-2);
        var sec = ('0' + (parseInt(time % 60))).slice(-2);
        var frm = ('0' + (100*(time - parseInt(time))*(FPS/100)).toFixed()).slice(-2);
    return (
        hour + "." + minute + "." + sec + "." + frm
    );
    } else {
        return "00.00.00.00";
    }
});

