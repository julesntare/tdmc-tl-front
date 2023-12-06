import { ApolloProvider } from "@apollo/client";
import React from "react";
import client from "./config/apollo-client";

export default function Providers({ children }: any): JSX.Element {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
