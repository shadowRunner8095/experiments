import { createFileRoute } from '@tanstack/react-router'

interface FakeFetchOptions<T> {
  data: T;
  time?: number;
}

export function fakeFetch<T>({
  data,
  time = 1500
}: FakeFetchOptions<T>){return new Promise<T>(res=>{
  setTimeout(()=>{
    res(data)

  }, time)
})}

export const Route = createFileRoute('/')({
  pendingComponent: ()=>"Loading",
  async loader() {
    const waitedData = await fakeFetch({
      data: {waited: true}
    })
    return {
      getData: fakeFetch({
        data: {
          hello: 'world'
        }
      }),
      waitedData
    }    
  },
})

