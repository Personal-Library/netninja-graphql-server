const express = require('express');
// Allows express to understand the GraphQL. Use as middleware
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/graphql', graphqlHTTP({ 
  schema: schema,
  graphiql: true 
}));

app.listen(PORT, () => {
	console.log(`Server is listening on port: ${PORT}`);
});

app.get('/', (req, res) => {
	res.send('<h1>Greetings</h1>');
});
