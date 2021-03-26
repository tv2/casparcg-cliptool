'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.CCG_GQL_SCHEME = void 0
const graphql_tag_1 = __importDefault(require('graphql-tag'))
exports.CCG_GQL_SCHEME = graphql_tag_1.default`
        type Subscription {
            channels: [Channels]
            playLayer: [Channels]
            infoChannelUpdated: String
            timeLeft: [Timeleft]
            mediaFilesChanged: Boolean
        },
        type Query {
            serverOnline: Boolean
            serverVersion: String
            channels: [Channels]
            layer(ch: Int!, l: Int!): String
            timeLeft(ch: Int!, l: Int!): String
            mediaFolders: [Folder]
            dataFolders: [Folder]
            templateFolders: [Folder]
        },
        type Channels {
            layers: [Layers]
        },
        type Layers {
            foreground: Foreground
            background: Background
        },
        type Foreground {
            name: String
            path: String
            length: Float
            loop: Boolean
            paused: Boolean
        }
        type Background {
            name: String
            path: String
            length: Float
            loop: Boolean
        }
        type Timeleft {
            timeLeft: Float
            time: Float
        }
        type Folder {
            folder: String
        }
        `
//# sourceMappingURL=GraphQlScheme.js.map
