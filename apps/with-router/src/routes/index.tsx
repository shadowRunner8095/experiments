import { createFileRoute } from '@tanstack/react-router'
import { Container } from 'inversify';
import { createContext, use, useCallback, useRef, useState, useSyncExternalStore, type ChangeEvent } from 'react';
import { BehaviorSubject } from 'rxjs';
import type { ChildObserver, ObserverWithState } from '../lib/Observer';

interface FakeFetchOptions<T> {
  data: T;
  time?: number;
}

export function fakeFetch<T>({
  data,
  time = 1500
}: FakeFetchOptions<T>) {
  return new Promise<T>(res => {
    setTimeout(() => {
      res(data)

    }, time)
  })
}

interface ChildContext {
  childContainer: Container,
  data: { products: Product[] }
}

const IndexContainerContext = createContext<ChildContext>(null!)

interface Product {
  id: string;
  label: string;
  price: string;
}

interface ProductsService {
  getProducts(): Promise<Product[]>
}

export const Route = createFileRoute('/')({
  pendingComponent: () => "Loading",
  beforeLoad({ context }) {
    const childContainer = new Container({
      parent: context.globalContainer
    })

    childContainer
      .bind<ProductsService>('ProductsService')
      .to(class {
        async getProducts() {
          return [
            {
              id: '123345',
              label: 'Product 1',
              price: '23'
            },
            {
              id: '12456778',
              label: 'Product 2',
              price: '72.30'
            }
          ]
        }
      })

      childContainer
        .bind<Promise<ObserverWithState<string>>>('ProductPriceObserver')
        .toDynamicValue(async ()=>{
          const { ObserverWithState } = await import('../lib/Observer');

          return new ObserverWithState('0')
        })

      childContainer
        .bind<Promise<ChildObserver<Promise<string>,string >>>('FinalPriceObserver')
        .toDynamicValue(async (ctx)=>{
          const parentObserver = await ctx
            .get<Promise<ObserverWithState<string>>>('ProductPriceObserver')
          const { ChildObserver } = await import('../lib/Observer')
      
          const child$ = new ChildObserver(
            Promise.resolve('0'),
            parentObserver,
            (childPrev, parentValue)=>Promise.resolve(childPrev + parentValue)
          );


          return child$;
        })
  

    return {
      childContainer
    }
  },
  async loader({
    context
  }) {
    const productsService = context
      .childContainer
      .get<ProductsService>('ProductsService')

    return {
      products: await productsService.getProducts()
    }
  },
  component: () => {
    const { childContainer } = Route.useRouteContext()
    const data = Route.useLoaderData()

    return <IndexContainerContext
      value={{
        childContainer,
        data
      }}>
      <Page />
    </IndexContainerContext>
  }
})

function Page() {
  console.log('asdasdas')
  return <main className='grid'>
    <div className='flex'>
      <Products />
      <Discount />
      <Price />
    </div>
  </main>
}

function Products() {
  const { data, childContainer } = use(IndexContainerContext);
  const observerRef = useRef<ObserverWithState<string>>(null);


  const onChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  )=>{
    observerRef.current ??= await childContainer
      .get<Promise<ObserverWithState<string>>>('ProductPriceObserver')

    const { value, checked } = event.target

    if(checked)
      observerRef.current.emit(()=>value)
  }, [])


  return data
    .products
    .map(({ id, label, price }) => <article key={id}>
      <p>{label}</p>
      <input
        onChange={onChange} 
        type="radio" 
        name="product-card" 
        data-id={id} 
        value={price} 
      />
    </article>)

}


interface ValidationResult {
  errorMessage?: string;
  isValid: boolean;
  discount: number;
}

type ExternalValidate = (code: string)=>Promise<ValidationResult>

//TODO: check desing of async creation
// of validation service
function Discount(){
  const [value, setValue] = useState('')
  const { childContainer } = use(IndexContainerContext);
  const [ query, setQuery  ] = useState<Promise<any>>()
  const externalValidate = useRef<ExternalValidate>(null);
  const finalPriceObserver = useRef<ChildObserver<Promise<string>, string>>(null)

  const onChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  )=>{
    if(!externalValidate.current)
      childContainer
        .get<Promise<ExternalValidate>>('ExternalValidate')
        .then(result =>externalValidate.current??=result )

    if(!finalPriceObserver.current)
      childContainer
        .get<Promise<ChildObserver<Promise<string>, string>>>('FinalPriceObserver')
        .then(result =>  finalPriceObserver.current ??=  result)

    const { value } = event.target
    const isMaxLength = value.length <= 7
    
    if(!/^\w$/.test(value) && isMaxLength)
      return;

    setValue(value)

    if(!isMaxLength)
      return;

    externalValidate.current ??= await childContainer
    .get<Promise<ExternalValidate>>('ExternalValidate')
  finalPriceObserver.current ??= await childContainer
    .get<Promise<ChildObserver<Promise<string>, string>>>('FinalPriceObserver')

    const inenrQuery = externalValidate.current(value)

    setQuery(inenrQuery)

    finalPriceObserver
      .current
      .emit((_, parentValue)=> inenrQuery.then(({
        discount
      })=> discount + parentValue ))
    
  }, [])


  return <div>
    <input 
      onChange={onChange}  
      value={value}
    />
  </div>
}

function Price(){
  const { childContainer } = use(IndexContainerContext)

  const priceObserver = use(
    childContainer
      .get<Promise<BehaviorSubject<Promise<number>>>>('FinalPriceObserver')
  );

  const pricePromise = useSyncExternalStore(()=>{
    priceObserver.subscribe(()=>{})

    return priceObserver.unsubscribe;
  }, ()=>priceObserver.getValue())


  const price = use(pricePromise)

  return <div>{price.toFixed(2)}</div>
}