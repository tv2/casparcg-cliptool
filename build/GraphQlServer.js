'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                  enumerable: true,
                  get: function () {
                      return m[k]
                  },
              })
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.CcgGraphQlServer = void 0
//GraphQl:
const apollo_server_1 = require('apollo-server')
const GraphQlScheme_1 = require('./graphql/GraphQlScheme')
//Utils:
require('./global')
const DEFAULTS = __importStar(require('./utils/CONSTANTS'))
class CcgGraphQlServer {
    constructor(pubsub, ccgChannel) {
        this.serverOnline = false
        this.pubsub = pubsub
        this.ccgChannel = ccgChannel
        this.setServerOnline = this.setServerOnline.bind(this)
        this.getServerOnline = this.getServerOnline.bind(this)
        this.setupGraphQlServer()
    }
    setupGraphQlServer() {
        // GraphQL resolver
        const resolvers = {
            Subscription: {
                channels: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_CHANNELS_UPDATED,
                        ]),
                },
                playLayer: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_PLAY_LAYER_UPDATED,
                        ]),
                },
                infoChannelUpdated: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_INFO_UPDATED,
                        ]),
                },
                timeLeft: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_TIMELEFT_UPDATED,
                        ]),
                },
                mediaFilesChanged: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_MEDIA_FILE_CHANGED,
                        ]),
                },
            },
            Query: {
                channels: () => {
                    return this.ccgChannel
                },
                layer: (obj, args, context, info) => {
                    const ccgLayerString = JSON.stringify(
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                    )
                    return ccgLayerString
                },
                timeLeft: (obj, args, context, info) => {
                    return (
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                            .foreground.length -
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                            .foreground.time
                    )
                },
                serverOnline: () => {
                    return this.getServerOnline()
                },
                mediaFolders: () => {
                    return global.mediaFolders
                },
                dataFolders: () => {
                    return global.dataFolders
                },
                templateFolders: () => {
                    return global.templateFolders
                },
                serverVersion: () => {
                    return global.serverVersion
                },
            },
            Channels: {
                layers: (root) => root.layer,
            },
            Layers: {
                foreground: (root) => root.foreground,
                background: (root) => root.background,
            },
            Foreground: {
                name: (root) => {
                    return root.name
                },
                path: (root) => {
                    return root.path
                },
                length: (root) => {
                    return root.length
                },
                loop: (root) => {
                    return root.loop
                },
                paused: (root) => {
                    return root.paused
                },
            },
            Background: {
                name: (root) => {
                    return root.name
                },
                path: (root) => {
                    return root.path
                },
                length: (root) => {
                    return root.length
                },
                loop: (root) => {
                    return root.loop
                },
            },
            Timeleft: {
                timeLeft: (root) => {
                    return (
                        root.layer[DEFAULTS.CCG_DEFAULT_LAYER - 1].foreground
                            .length -
                        root.layer[DEFAULTS.CCG_DEFAULT_LAYER - 1].foreground
                            .time
                    )
                },
                time: (root) => {
                    return root.layer[DEFAULTS.CCG_DEFAULT_LAYER - 1].foreground
                        .time
                },
            },
        }
        const typeDefs = GraphQlScheme_1.CCG_GQL_SCHEME
        const server = new apollo_server_1.ApolloServer({
            typeDefs,
            resolvers,
        })
        server.listen(DEFAULTS.DEFAULT_GRAPHQL_PORT, () =>
            console.log(
                `GraphQl listening on port ${DEFAULTS.DEFAULT_GRAPHQL_PORT}${server.graphqlPath}`
            )
        )
    }
    setServerOnline(state) {
        this.serverOnline = state
    }
    getServerOnline() {
        return this.serverOnline
    }
}
exports.CcgGraphQlServer = CcgGraphQlServer
//# sourceMappingURL=GraphQlServer.js.map
