import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support/ssr";

import makeClient from "@/lib/apollo-provider";

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
