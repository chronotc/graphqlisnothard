import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider, useMutation } from 'react-apollo-hooks';
import ApolloClient, { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';

const GET_USERS = gql`
  {
    users {
      id
      firstname
      todos {
        id
      }
    }
  }
`;

const client = new ApolloClient({
  uri: "https://fakeql.com/graphql/f599fbe02ad502af0acd04ef54a4e829",
  connectToDevTools: true
});

const Tracking = ({ children }) => {
  const { sendQuery } = useLazyQuery(TRACK_COMPONENT)
  return children
};

const UsersList = () => {
  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    return <div>error</div>
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div style={{ border: 'black 1px solid'}}>
        User:
        {
          data.users.map(({ firstname, id }) => (
            <div key={id}>
              {
                firstname
              }
            </div>
          ))
        }
    </div>
  );
}

const UsersListTodos = () => {
  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    return <div>error</div>
  }

  if (loading) {
    return <div>loading... todos</div>
  }

  return (
    <div style={{ border: 'red solid 1px'}}>
      { data.users.map(
        ({ id, firstname, todos }) => (
          <div key={`${id}-todos`}>
            <div>
              { firstname }
            </div>
            <div>TODOS: </div>
            {
              todos.map(({ id: TODOID }) => (<div key={TODOID}>{TODOID} </div>))
            }
          </div>
      ))}
    </div>
  )
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <UsersList />
      <UsersListTodos />
    </ApolloProvider>
  );
}

render(<App />, document.getElementById('root'));