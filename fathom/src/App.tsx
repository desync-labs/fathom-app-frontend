// import winston from 'winston';
// import { WinstonProvider } from 'winston-react';
import 'fontsource-roboto'
import { HashRouter as Router} from "react-router-dom";
import MainLayout from './components/Dashboard/MainLayout';

// const logger = winston.createLogger({
//   // ...
//   exceptionHandlers: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'combined.log'})
//   ],
//   transports: [
//     // ...
//     new winston.transports.Console()
//   ]
// });

function App() {
  return (
    // <WinstonProvider logger={logger}>
    <Router>
      <MainLayout/>
    </Router>
    // </WinstonProvider>
  );
}

export default App;
