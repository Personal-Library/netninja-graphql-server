const graphql = require('graphql');
// using lodash only for processing dummy data
const _ = require('lodash');

// Import types from graphql
const {
	GraphQLInt,
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

// Import models we made from mongoose
const Book = require('../models/book.js');
const Author = require('../models/author.js');

// // dummy data
// const books = [
// 	{ name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
// 	{ name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
// 	{ name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
// 	{ name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
// 	{ name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
// 	{ name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
// ];
// const authors = [
// 	{ name: 'Patrick Rothfuss', age: 44, id: '1' },
// 	{ name: 'Brandon Sanderson', age: 42, id: '2' },
// 	{ name: 'Terry Pratchett', age: 66, id: '3' },
// ];

// If you have a complex type, you define the name, its fields, and
// how complex fields are resolved
const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				// return _.find(authors, { id: parent.authorId });
				return Author.findById(parent.authorId)
			},
		},
	}),
});

// An object is passed, with the name and fields keys, if the data is to be 
// extended then a resolve(parents, args) {} method must be passed
// In the resolve method you can use mongoose to map the objects you need
const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return _.filter(books, { authorId: parent.id });
				return Book.find({ authorId: parent.id })
			},
		},
	}),
});

// After declaring the complex types that will be used you define the queries
// Thus in the RootQuery you handle the query 'routing'
// These are all queries that can be passed to Apollo
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(books, { id: args.id });
				return Book.findById(args.id);
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(authors, { id: args.id });
				return Author.findById(args.id);
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find();
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return Author.find();
			},
		},
	},
});

// In GraphQL you need to explicitly define your mutations
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				// This author is our mongoose model
				// Inside this resolve function is plain script
				let author = new Author({
					name: args.name,
					age: args.age,
				});
				// Now it is saved to the database
				// Return the method so that you get a response
				return author.save();
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId,
				});
				return book.save();
			},
		},
	},
});

// I'm sure you can use ES6, but Net Ninja was using CommonJS
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
