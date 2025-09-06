import type { PropsWithChildren } from 'react';
import './App.css';

const App = (props: PropsWithChildren) => {
  return (
    <div className="content" {...props} />
  );
};

export default App;
