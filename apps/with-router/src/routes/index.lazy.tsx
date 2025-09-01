import { createLazyFileRoute } from '@tanstack/react-router'
import { Route as IndexRoute } from '.'
import { Suspense, use, useCallback, useState } from 'react';
import SearchInputWithPromiseValidation from '../components/SearchInputWithAsyncValidation';
import { wait } from '../utils';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})


const GetData= ()=>{
  const { getData } =  IndexRoute.useLoaderData();
  const data = use(getData);

  return <div>{data.hello}</div>
}

const ShowDataAgain = ()=>{
   const [visible, setVisible] = useState(false)

  

   const onClick = useCallback(()=>{
    setVisible(true)
   }, [])

  return <div>
    <button onClick={onClick}>Show</button>
    {visible &&  <GetData />}
    </div>
}

function RouteComponent() {
    return <div>
        I already rendered 
        <Suspense fallback={<div>'I am the inner part loading...'</div>}>
        <GetData />
        <ShowDataAgain/>
    </Suspense>
        </div>
        
}
