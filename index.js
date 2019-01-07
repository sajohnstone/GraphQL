const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const Message = require('./resolvers/message');

/*
Example messages:
mutation {
  createMessage(input: {
    author: "andy",
    content: "hope is a good thing",
  }) {
    id
  }
}

{ getMessage(id:"f4530931dabf99ffb9d3") {
  id, content, author
} }

*/

// Maps username to content
var fakeDatabase = {};

root = {
getMessage: function ({id}) {
    if (!fakeDatabase[id]) {
    throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
},
createMessage: function ({input}) {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
},
updateMessage: function ({id, input}) {
    if (!fakeDatabase[id]) {
    throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
},
};

function loggingMiddleware(req, res, next) {
  console.log('ip:', req.ip);
  next();
}

// Construct a schema, using GraphQL schema language
//const s = fs.readFileSync('./schema.graphql', 'utf8');
//console.log(s);
fs.readFile('./schema.graphql', 'utf8', (err, data) => {  
  if (err) throw err;
  const s = data;
  console.log(s);
  const schema = buildSchema(s);

  var app = express();
  app.use(loggingMiddleware);
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: false,
  }));
  app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
  });  
});

