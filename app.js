const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const chalk = require('chalk');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

/**
 * Environment Variables
 */
dotenv.config();

/**
 * Express App
 */
const app = express();
const { PORT } = process.env;

/**
 * Middlewares
 */
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type RootQuery {
      timetable(name: String): [String!]!
    }

    type RootMutation {
      createTimetable(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    timetable: args => ['Cloud', 'C#', 'Web'],
    createTimetable: (args) => {
      const timetableName = args.name;
      return timetableName;
    },
  },
  graphiql: true,
}));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
