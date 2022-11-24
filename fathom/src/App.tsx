import "fontsource-roboto";
import "./App.css";
import { HashRouter as Router } from "react-router-dom";
import MainLayout from "components/Dashboard/MainLayout";
import { ApolloProvider } from "@apollo/client";
import { client } from "apollo/client";

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <MainLayout />
      </ApolloProvider>
    </Router>
  );
}

export default App;
