export enum AmpMessageTypes {
    COMMAND = 'CMDS',
    /*
    Send: CMDS00042001\n
    “CMDS” is the command wrapper label.
    “0004” is the command length, not a byte count.
    “2001” is the command itself, in this case, the play command.
    */
    CONNECTION = 'CRAT',
    /*
    CRAT0007204Vtr1\n
    Where:
    “CRAT” tells the AMP listener that a connection is coming. “0007” is the total number of characters to follow.
    “2” is the connection mode: “channel”
    “04” is the channel length
    “VtrX” is the channel where X is a value from 1 to 4.
    */
    DISCONNECT = 'STOP',
    /* Always: STOP0000\n */
}

export enum AmpReceiveCommandTypes {
    // A2140000   - Return current clip??
    GET_DEVICE_TYPE_0011 = '0011',
    STOP_2000 = '2000',
    PLAY_2001 = '2001',
    CUE_2032 = '2032',
    //*** QUE_TO_BEGIN 2031 is used as STOP
    STOP_FORCE_2031 = '2031', // This command is used as STOP command, as GV does not send STOP command
    //*** QUE_TO_END 2431 is used as LOOP OFF
    LOOP_OFF_2431 = '2431', // This is used as LOOP OFF as GV sends LOOP OFF when playing a LOOP
    //**** LOOP is only used as LOOP ON */
    LOOP_4142 = '4142',

    GET_DEFAULT_FOLDER_A02A = 'A02A', // Return 822a0009000764656661756c74  (Default)
    GET_FOLDER_LIST_A02B = 'A02B', // Return 822b + message length hex(FFFF) + each folder as array in length hex(FFFF)+foldername & Return 802b as "List finish"
    GET_MACHINE_ID_A02C = 'A02C', // Return 822c000b0a454a3132343830303038 (probably the machine to find thumbnails)
    SET_WORKING_FOLDER_A20E = 'A20E',
    // a20e 00xx000e{foldername in hex}
    // Set working folder (will wait for cache rebuild)
    GET_WORKING_FOLDER_A00F = 'A00F', // Returns: 820f000500036e6577e3
    GET_CLIP_LIST_A115 = 'A115', // Returns: 8a14+message length hex(FFFF)+each clip as array in length hex(FFFF)+clipname
    NUMBER_OF_CLIPSA026 = 'A026',
    // (A0.26) ID Count Request -- Number of clips in folder
    GET_FIRST_CLIP_ID_A214 = 'A214',
    // (A2.14) ID Info Request -- Get clip info
    // Looks like it's the first clip in the folder????
    ID_CHANGED_LIST_A012 = 'A012',
    //- (A0.12) IDs Changed List Request

    //- (AX.14) List First ID
    //- (AX.15) List Next ID
    //- (AX.18) ID Status Request

    ID_LOADED_A016 = 'A016', // (A0.16) ID Loaded Request
    CUE_FILE_AA18 = 'AA18', // AA18{filename}
    GET_CLIP_DATA_AA13 = 'AA13',
    // AA13{filename} -- >  8a13002801d945
    // Get Clip data request (larger dataset)
    // example: 8a13002801d95ec198d5fc8001d95ec294f6aa0018420000080902020001000000010000000000000000048e
    DURATION_REQUEST_A217 = 'A217',
    // A217{filename} -- >  841709150000 (as AA13 but only duration)
    //- (A2.17) ID Duration Request
    GET_START_TIME_A225 = 'A225',
    // A225{filename} -- >  842500000000
    //- (A2.25) ID Start Time Request
    AUTOMODE_ON_4041 = '4041',
    TIMECODE_MODE_4136 = '4136',
    IN_PRESET_4A14 = '4A14', // 4a1400xx00yy  xx+yy length?      at 0 fields - 4a1400220020{filename in hex}
    UNKNOWN_A115 = 'A115', // A11503 response: 8014
    SET_GANG_MASK_A132 = 'A132', // Set Gang Mask 0x8f
    GET_GANG_INFORMATION_A033 = 'A033', // Gang 0xffffff8f
    SET_GANG_INFORMATION_A034 = 'A034', // Channels Load Clips Independently
    STATUS_TIME_610C01 = '610C01', // 610C01 Port status time?
    STATUS_PLAY_612001 = '612001', // 612001 Port status PlayEnd // 712002
    STATUS_CUEING_612003 = '612003',
    // 612003 Port status Cueing
    // Still queing: 7320828080
    // Queing done: 732002a081
    STATUS_CUE_START_612041 = '612041', // 612041 Port status CueStart // 712040
    STATUS_SENSE_61200F = '61200f',
    // Returns: 7f2002a081812000200000000000002200
    // 61200f Port status Eject??  //7f200281808140
    // 612041 Port status CueStart // 712040
    // 612003 Port status CuePlay // 732082808015
    // 612001 Port status Play // 71200293
    // 612001 Port status Play End // 712002
    // 610C01 Port status time?

    //Found in docs:
    // 61.0C	Current Time Sense
    // 61.20	Status Sense

    // Loading a new clip there commands are requested:

    // CMDS0006612001
    // CMDS0006612003
    // CMDS0006612041
}
