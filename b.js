let express = require('express');
let bodyParser = require('body-parser');
let {graphqlExpress} = require('graphql-server-express');
let schema = require('./schema.js');
let resolvers = require('./resolvers');
let {makeExecutableSchema} = require('graphql-tools');


const PORT = 3000;
const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolver: resolvers,
});


var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema: schema}));
app.listen(PORT);