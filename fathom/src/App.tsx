import 'fontsource-roboto'
import './App.css'
import { HashRouter as Router} from "react-router-dom";
import MainLayout from 'components/Dashboard/MainLayout';

function App() {
  return (
    <Router>
      <MainLayout/>
    </Router>
  );
}

export default App;
