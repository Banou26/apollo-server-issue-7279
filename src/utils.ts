// fix for ApolloServerPluginDrainHttpServer checking that we are in a browser?
// @ts-expect-error
globalThis.window = globalThis
