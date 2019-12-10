const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

const MOVIESDUMMYDATA = [
  { id: 1, name: "The Lord of the Rings", genre: "Fantasy" },
  { id: 2, name: "Back to the future", genre: "Sci-fi" },
  { id: 3, name: "Terminator", genre: "Action" }
]
const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    movie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parentValue, args) {
        return MOVIESDUMMYDATA.find(movie => movie.id == args.id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parentValue, args) {
        return MOVIESDUMMYDATA;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
