import { createRouter, RouterProvider } from '@tanstack/react-router';
import './App.css';
import { Container } from 'inversify'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { useMemo } from 'react';

// Create a new router instance
const router = createRouter({ routeTree, context: { globalContainer:  null as unknown as Container} })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


const App = () => {
  const globalContainer = useMemo(()=>{
    const container = new Container()

    return container;
  }, [])
  return (<>
    <RouterProvider 
      context={{
        globalContainer
      }} 
    router={router} 
   />
  </>
  );
};

export default App;
