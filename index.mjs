import dotenv from "dotenv";
import cors from "cors";
import { Invoice } from "./src/model.mjs";
import { connectToDb } from "./src/database.mjs";
import AWS from "aws-sdk";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

dotenv.config()

// Construct a schema, using GraphQL schema language
const config = {
  s3_config: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    destinationBucketName: process.env.AWS_DESTINATION_BUCKET_NAME,
    region: "eu-central-1",
  },
  mongo_url: process.env.MONGO_URL,
};

//connecting to the database
connectToDb(config.mongo_url);

const typeDefs = gql`
  type Invoice {
    id: ID
    iban: String
    vatNumber: String
  }
  type Query {
    hello: String
    invoiceList: [Invoice]
  }
  type UploadedFileResponse {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }
  type Mutation {
    singleUpload(file: Upload!, invoiceId: ID): UploadedFileResponse!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    invoiceList: () => {
      return Invoice.find({});
    },
  },
  Mutation: {
    singleUpload: async (root, args) => {
      // 1. Get the data from the graphql Layer
      const { stream, filename, mimetype, encoding } = await args.file; // from type Upload
      console.log(config);
      // Do work 💪
      // 2. Initialize S3
      const params = {
        Bucket: config.s3_config.destinationBucketName, // the bucked a.k.a folder to upload to
        Key: filename, // name of the file in S3
        Body: stream, // the file itself
      };

      // creadentials for AWS
      AWS.config = new AWS.Config();
      AWS.config.update({
        region: config.s3_config.region || "ca-central-1",
        accessKeyId: config.s3_config.accessKeyId,
        secretAccessKey: config.s3_config.secretAccessKey,
      });

      // Get the S3 package
      const s3 = new AWS.S3();

      // 3. Push the file
      const data = await s3.upload(params).promise();
      return { filename, mimetype, encoding, url: data.Location };
    },
    invoiceList: () => {
      return Invoice.Create({});
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.use(cors());
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);