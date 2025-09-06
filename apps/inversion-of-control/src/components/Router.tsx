import { createContext, Suspense, use, useMemo, useSyncExternalStore, type LazyExoticComponent, type PropsWithChildren } from "react";
import { RouterObserver } from "../lib/RouterObserver";

export const RouterContext = createContext<any>(null!);



export const Route = ({LazyElement}: {LazyElement: LazyExoticComponent<any>})=>{
  const routerData = use(RouterContext);

  const href: string = useSyncExternalStore(routerData.subscribe, routerData.getSnapShot);

  return href.includes('page1') && <LazyElement />;
}


export const Router = ({children}: PropsWithChildren)=>{
  const routerData = useMemo(()=>{
    const rotuer = new RouterObserver()

    return {
      subscribe: (cb: any) =>rotuer.subscribe(cb),
      getSnapShot: ()=>rotuer.getvalue().href
    }
  }, []);

  return <RouterContext 
    value={routerData}
  >
    <Suspense 
      fallback={'loading'}
    >
      {children}
    </Suspense>
  </RouterContext>
}

