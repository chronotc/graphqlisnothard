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
      flagged
      todos {
        description
      }
    }
  }
`;

const client = new ApolloClient({
  uri: "http://localhost:4000",
  connectToDevTools: true
});

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
        Users:
        {
          data.users.map(({ firstname, id, flagged }) => (
            <div key={id}>
              {
                `${firstname} - `
              }
              {
                flagged && <span>Flagged</span>
              }
              <RemoveButton id={id} />
              <ToggleFlag id={id} />
            </div>
          ))
        }
    </div>
  );
}

const ToggleFlag = ({ id }) => {
  const TOGGLE_FLAG = gql`
    mutation toggleFlag($input: ToggleFlagInput) {
      toggleFlag(input: $input) {
        user {
          id
          flagged
        }
      }
    }
  `;

  const [toggleFlag, { loading, data, error }] = useMutation(TOGGLE_FLAG, {
    variables: {
      input: {
        id
      }
    }
  });

  return <span onClick={() => toggleFlag()}>[toggle-flag]</span>
}


const RemoveButton = ({ id }) => {
  const REMOVE_USER = gql`
    mutation RemoveUser($input: RemoveUserInput) {
      removeUser(input: $input) {
        users {
          id
          firstname
        }
      }
    }
  `;


  const [removeUser, { loading, data, error }] = useMutation(REMOVE_USER, {
    variables: {
      input: {
        id
      }
    }
  });

  return <span onClick={() => removeUser()}>[X]</span>
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
      Todos:
      { data.users.map(
        ({ id, firstname, todos, flagged }) => (
          <div key={`${id}-todos`}>
            <div style={{marginTop: '20px'}}>
              { firstname } { flagged && <span>Flagged</span>}
            </div>
            <div style={{marginBottom: '10px'}}></div>
            {
              todos.map(({ description }, index) => (<div key={index}>- {description} </div>))
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