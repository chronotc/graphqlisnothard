import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo-hooks';
import ApolloClient, { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';

const GET_FIRST_5_FILMS = gql`
  {
    allFilms (first: 5) {
      films {
        created
        releaseDate
        title
      }
    }
  }
`;

const client = new ApolloClient({
  uri: "https://graphql.org/swapi-graphql/"
});

const StarWarsList = () => {
  const { loading, data, error } = useQuery(GET_FIRST_5_FILMS);

  if (error) {
    return <div>error</div>
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
        Star Wars films:
        {
          data.allFilms.films.map(({ title }) => (
            <div key={ title }>
              {
                title
              }
            </div>
          ))
        }
    </div>
  );
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <StarWarsList />
    </ApolloProvider>
  );
}

render(<App />, document.getElementById('root'));