const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type Invoice {
    id:ID
    iban: String
    vatNumber:String
  }
  type Query {
    hello: String
    invoiceList: [Invoice]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    invoiceList: ()=> {
      return  [{
          id:'abcd124',
          iban:'DE80500105178153863472',
          vatNumber:'DE70070'
      }]
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);