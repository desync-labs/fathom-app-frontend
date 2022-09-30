import 'fontsource-roboto'
import { HashRouter as Router} from "react-router-dom";
import MainLayout from './components/Dashboard/MainLayout';

function App() {
  return (
    <Router>
      <MainLayout/>
    </Router>
  );
}

export default App;
