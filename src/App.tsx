import "fontsource-roboto";
import "./App.css";
import MainLayout from "components/Dashboard/MainLayout";
import { ApolloProvider } from "@apollo/client";
import { client } from "apollo/client";
import { SyncProvider } from "context/sync";
import { PricesProvider } from "context/prices";
import { Updaters } from "apps/dex";
import { SharedProvider } from "context/shared";
import { Provider } from "react-redux";
import store from "apps/dex/state";
import { HashRouter as Router } from "react-router-dom";
import { ContextProviders, Updaters as ChartUpdaters } from "apps/charts";

function App() {
  return (
    <ApolloProvider client={client}>
      <SyncProvider>
        <PricesProvider>
          <SharedProvider>
            <Provider store={store}>
              <Router>
                <ContextProviders>
                  <>
                    <Updaters />
                    <ChartUpdaters />
                    <MainLayout />
                  </>
                </ContextProviders>
              </Router>
            </Provider>
          </SharedProvider>
        </PricesProvider>
      </SyncProvider>
    </ApolloProvider>
  );
}

export default App;
