import React, { 

  useMemo,  
} from 'react';
import ReactDOM from 'react-dom/client';

import { AutoContainer } from './minimal-container/auto-container';
import type { ServicesById } from './types';
import appendBindings from './pages/(root)/-register.index';


const rootEl = document.getElementById('root');

const enum Services {
  MAIN = 'main'
}


const MainApp = ()=>{
  const globalContainer = useMemo(()=>{
    const container = new AutoContainer<ServicesById>();
    

    return appendBindings(container);
  }, [])

  return globalContainer.get(Services.MAIN)
}


if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <MainApp />
    </React.StrictMode>,
  );
}
