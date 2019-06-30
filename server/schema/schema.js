const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// var books = [
//     {'id' : '1', 'name' : 'Java pro','genre' : 'programming', authorid : '1'},
//     {'id' : '2', 'name' : 'Java pro','genre' : 'programming', authorid : '2'},
//     {'id' : '3', 'name' : 'Java pro','genre' : 'programming', authorid : '2'},
//     {'id' : '4', 'name' : 'Java pro','genre' : 'programming', authorid : '1'},
// ];

// var authors = [
//     {'id' : "1", 'name' : 'Tanuj Dave', 'age' : 30},
//     {'id' : '2', 'name' : 'Tanuj Dave', 'age' : 30},
//     {'id' : '3', 'name' : 'Tanuj Dave', 'age' : 30},
//     {'id' : '4', 'name' : 'Tanuj Dave', 'age' : 30},
//     {'id' : '5', 'name' : 'Tanuj Dave', 'age' : 30},
// ]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id : {type: GraphQLID},
        name : {type: GraphQLString},
        age : {type: GraphQLInt},
        books : {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // console.log(_.find(books, {authorid: parent.id}))
                // return _.filter(books, {authorid: parent.id})
                return Book.find({authorId: parent.id});
            }
        }
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id : {type: GraphQLID},
        name : {type: GraphQLString},
        genre : {type: GraphQLString},
        author : {
            type: AuthorType,
            resolve(parent, args) {
                // console.log(parent.authorId)
                // return _.find(authors, {id: parent.authorid})
                return Author.findById(parent.authorId);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Book.findById(args.id)
                // return _.find(books, {id : args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id)
                // return _.find(authors, {id : args.id});
            }
        },
        books : {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({})
                // return books
            }
        },
        authors : {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({})
                // return authors
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve (parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve (parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId        
                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation : Mutation
});