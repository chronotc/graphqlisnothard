const { ApolloServer, gql } = require('apollo-server');

let users = [{
  id: '1',
  name: 'silla'
}, {
  id: '2',
  name: 'dean'
}, {
  id: '3',
  name: 'pepe'
}]

let todos = [{
  userId: '1',
  description: 'Washing'
},
{
  userId: '1',
  description: 'Cleaning'
},
{
  userId: '1',
  description: 'Coding'
},
{
  userId: '2',
  description: 'Gaming'
},
{
  userId: '3',
  description: 'Cooking'
}
]

// The GraphQL schema
const typeDefs = gql`
  type Query {
    users: [User]
  }

  type Mutation {
    toggleFlag(input: ToggleFlagInput): ToggleFlagResponse
    removeUser(input: RemoveUserInput): RemoveUserResponse
  }

  input RemoveUserInput {
    id: ID
  }

  type RemoveUserResponse {
    users: [User]
  }

  input ToggleFlagInput {
    id: ID
  }

  type ToggleFlagResponse {
    user: User
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
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users: (parent, args, context) => getUsers()
  },
  Mutation: {
    toggleFlag: (parent, args) => {
      const id = args.input.id;
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
    removeUser: (parent, args) => {
      const id = args.input.id;
      users = users.filter(user => user.id !== id);
      return users;
    }
  },
  RemoveUserResponse: {
    users: () => getUsers()
  },
  ToggleFlagResponse: {
    user: (id) => getUserById(id)
  },
  User: {
    firstname: user => user.name,
    todos: user => {
      return getUserTodos(user.id)
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});


const getUsers = () => users

const getUserById = (id) => users.filter(user => user.id === id)[0]

const getUserTodos = (id) => todos.filter(todo => todo.userId === id)