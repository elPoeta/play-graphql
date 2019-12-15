const graphql = require('graphql');
let uuid = 3;
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;

let MOVIESDUMMYDATA = [
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

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        const movie = {
          id: ++uuid,
          name: args.name,
          genre: args.genre
        }
        MOVIESDUMMYDATA = [...MOVIESDUMMYDATA, movie];
        return movie
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        const movie = {
          id: args.id,
          name: args.name,
          genre: args.genre
        }
        const foundMovie = MOVIESDUMMYDATA.find(movie => movie.id == args.id);
        if (!foundMovie) {
          return null
        }
        MOVIESDUMMYDATA[args.id] = { ...movie };
        return MOVIESDUMMYDATA[args.id];
      }

    },
    deleteMovie: {
      type: MovieType,
      args:{
        id: {type:GraphQLID}       
      },
      resolve(parentValue,args){
        MOVIESDUMMYDATA = MOVIESDUMMYDATA.filter(movie => movie.id != args.id);
        return MOVIESDUMMYDATA[args.id] || null;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
