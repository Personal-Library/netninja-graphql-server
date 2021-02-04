const express = require('express');
const mongoose = require('mongoose');

// Allows express to understand the GraphQL. Use as middleware
const { graphqlHTTP } = require('express-graphql');
// Bring in GraphQL Schema
const schema = require('./schema/schema.js');
// Config file holding Mongo URI
const config = require('./config.js') ;
// Initiate server and declare port
const app = express();
const PORT = process.env.PORT || 4000;

// Use mongoose as middleman ORM
mongoose.connect(config.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Lets us know that we are connected to MongoDB
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!')
});

// Use GraphQLHTTP as middleman
app.use('/graphql', graphqlHTTP({ 
  schema: schema,
  graphiql: true, 
}));

// Lets us know our development port is live
app.listen(PORT, () => {
	console.log(`Server is listening on port: ${PORT}`);
});

// API Homepage
app.get('/', (req, res) => {
  res.status(200).send(`
    <h1>Greetings, friend ^.^</h1>
    <pre>
            ______
          &lt; Moo! &gt;
            ------
                  \\   ^__^
                    \\ (oo)\\_______
                      (__)\\       )\\/\\
                          ||----w |
                          ||     ||
    </pre>
  `)
})
