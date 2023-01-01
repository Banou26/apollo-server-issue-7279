## Repro

accessing [the sandbox](http://localhost:4000/graphql) and sending this request
```gql
  query GetBooks {
    books {
      title
      author
      ... @defer {
        test {
          foo
        }
      }
    }
  }
```
will result in a `Unknown directive \"@defer\".` error
