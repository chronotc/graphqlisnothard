const { ApolloServer, gql } = require('apollo-server');
const User = require('./user-data-source')

// The GraphQL schema
const typeDefs = gql`
  type Query {
    users: [User]
  }

  type User {
    id: String
    firstname: String
    flagged: Boolean
    todos: [Todo]
  }

  type Todo {
    description: String
  }

  type Mutation {
    toggleFlag(input: ToggleFlagInput): ToggleFlagResponse
    removeUser(input: RemoveUserInput): RemoveUserResponse
  }

  input ToggleFlagInput {
    id: ID
  }

  type ToggleFlagResponse {
    user: User
  }

  input RemoveUserInput {
    id: ID
  }

  type RemoveUserResponse {
    users: [User]
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users: (_, __, { userAPI: { getUsers } }) => getUsers()
  },
  User: {
    id: parent => parent.id,
    firstname: parent => parent.name,
    todos: (parent, __, {userAPI: { getTodos }
    }) => getUserTodos(parent.id, getTodos)
  },
  Mutation: {
    toggleFlag: (_, args, { userAPI: { getUsers } }) => {
      const id = args.input.id;
      let users = getUsers();

      users = users.map(user => {
        if (user.id === id) {
          return {
            ...user,
            flagged: !user.flagged
          }
        }

        return user;
      });

      return id;
    },
    removeUser: (_, args, { userAPI: { getUsers } }) => {
      const id = args.input.id;
      let users = getUsers();

      users = users.filter(user => user.id !== id);

      return users;
    }
  },
  RemoveUserResponse: {
    users: (_, __, { userAPI: { getUsers } }) => getUsers()
  },
  ToggleFlagResponse: {
    user: (parent, __, { userAPI: { getUsers } }) =>  getUserById(parent, getUsers)
  },
};

const getUserTodos = (id, todos) => todos().filter(todo => todo.userId === id)

const getUserById = (id, users) => users().filter(user => user.id === id)[0]

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    userAPI: new User()
  })
});

server.listen().then(({
  url
}) => {
  console.log(`🚀 Server ready at ${url}`);
});
