import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let apiUrl = process.env.NEXT_PUBLIC_API_URL;

const httpLink = createHttpLink({
  uri: apiUrl,
  fetchOptions: {
    mode: 'cors'
  }
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAnalytics: {
            merge: true,
          },
        },
      },
    },
  }),
  credentials: "include",
});

export default client;
