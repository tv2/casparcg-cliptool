'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.generateCcgDataStructure = void 0
exports.generateCcgDataStructure = (ccgNumberOfChannels, ccgNumberOfLayers) => {
    let ccgChannels = []
    // Assign empty values to ccgChannel object
    for (let ch = 0; ch < ccgNumberOfChannels; ch++) {
        ccgChannels.push({ layer: [] })
        for (let l = 0; l < ccgNumberOfLayers; l++) {
            ccgChannels[ch].layer.push({
                foreground: {
                    name: '',
                    path: '',
                    time: 0.0,
                    length: 0.0,
                    loop: false,
                    paused: true,
                },
                background: {
                    name: '',
                    path: '',
                    time: 0,
                    length: 0,
                    loop: false,
                    paused: true,
                },
            })
        }
    }
    return ccgChannels
}
//# sourceMappingURL=ccgDatasctructure.js.map
