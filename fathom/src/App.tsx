import React from 'react';
// import winston from 'winston';
// import { WinstonProvider } from 'winston-react';
import 'fontsource-roboto'
import Dashboard from './components/Dashboard/Dashboard';

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
      <Dashboard/>
    // </WinstonProvider>
  );
}

export default App;
