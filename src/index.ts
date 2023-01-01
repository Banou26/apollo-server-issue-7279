import './utils'

import * as http from 'http'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFile } from 'fs/promises'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const __dirname = dirname(fileURLToPath(import.meta.url))

const { json } = bodyParser

interface MyContext {
  token?: String
}

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    test: {}
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    test: {}
  },
];

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

export const resolvers = {
  Query: {
    books: () => books,
    // books: async function*() {
    //   for await (const book of books) {
    //     yield book
    //   }
    // }
  },
  Test: {
    foo: async () => {
      await wait(1000)
      return 'bar'
    }
  }
}


const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer<MyContext>({
  typeDefs: await readFile(resolve(__dirname, '../src/schema.graphql'), { encoding: 'utf-8' }),
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

app.use(
  '/graphql',
  cors<cors.CorsRequest>({ origin: '*' }),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token })
  })
)

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))
console.log(`🚀 Server ready at http://localhost:4000/graphql`)


// works while using `graphql@^16.0.0-experimental-stream-defer.5`
// const req = `
// query GetBooks {
//   books {
//     title
//     author
//     ... @defer {
//       test {
//         foo
//       }
//     }
//   }
// }

// `

// const requestObject = {
//   "query": req,
//   "variables": {},
//   "operationName": "GetBooks",
//   "http": {
//       "body": {
//           "operationName": "GetBooks",
//           "variables": {},
//           "query": req
//       },
//       "headers": {},
//       "method": "POST",
//       "search": ""
//   }
// }

// const deferRes = await server.executeOperation(requestObject)

// console.log('deferRes', deferRes.body.singleResult)
