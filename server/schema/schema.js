const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

var books = [
    {'id' : '1', 'name' : 'Java pro','genre' : 'programming', authorid : '1'},
    {'id' : '2', 'name' : 'Java pro','genre' : 'programming', authorid : '2'},
    {'id' : '3', 'name' : 'Java pro','genre' : 'programming', authorid : '2'},
    {'id' : '4', 'name' : 'Java pro','genre' : 'programming', authorid : '1'},
];

var authors = [
    {'id' : "1", 'name' : 'Tanuj Dave', 'age' : 30},
    {'id' : '2', 'name' : 'Tanuj Dave', 'age' : 30},
    {'id' : '3', 'name' : 'Tanuj Dave', 'age' : 30},
    {'id' : '4', 'name' : 'Tanuj Dave', 'age' : 30},
    {'id' : '5', 'name' : 'Tanuj Dave', 'age' : 30},
]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id : {type: GraphQLID},
        name : {type: GraphQLString},
        age : {type: GraphQLInt},
        books : {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                console.log(_.find(books, {authorid: parent.id}))
                return _.filter(books, {authorid: parent.id})
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
                console.log(parent)
                return _.find(authors, {id: parent.authorid})
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
                return _.find(books, {id : args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return _.find(authors, {id : args.id});
            }
        },
        books : {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books
            }
        },
        authors : {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery
});