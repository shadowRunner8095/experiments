import { useState, useCallback, useRef, Suspense, use, memo, type ChangeEvent } from 'react';
import { CharacterCard, IntersectionSentinel, LoadingSpinner, SearchInput } from './SearchComponents';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

interface SearchFunction {
  (value: string, page?: number): Promise<Array<{ id: string; text: string }>>;
}

interface MainSearchProps {
  search: SearchFunction;
  withInitialAction?: boolean;
}

interface ContentsProps {
  data: Promise<Array<{ id: string; text: string }>>;
  isFinal?: boolean;
  onIntersection: ()=> void
}

function Contents({ data, isFinal, onIntersection }: ContentsProps) {
  const result = use(data);

  if(result.length)
  return <>
    <MemoContenPresentation data={result}/>
    {isFinal && 
      <IntersectionSentinel
        onIntersect={onIntersection}
        />
    }
  </>
}

interface ContentPresentationProps{
  data: Awaited<ContentsProps['data']>
}

function ContentPresenatation({data}: ContentPresentationProps){
  console.log('rendering', data)

  return (
    <div>
      {data?.map((props) => <CharacterCard key={props.id} {...props} />)}
    </div>
  );
}


const MemoContenPresentation = memo(ContentPresenatation)

const CustomError = ({
  error
}: FallbackProps) => {
  return <div style={{minHeight: '100vh'}}>
    {error.message}
  </div>
}


export function MainSearch({ search, withInitialAction }: MainSearchProps) {
  const paginationRef = useRef<{ page: 0 }>(null);
  const currentValueRef = useRef<string>('');

  const [searchPromises, setSearchPromises] = useState<Array<ReturnType<SearchFunction>>>(
    withInitialAction? ()=>[ search('test1')]: []
  );

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    currentValueRef.current = value;

    if (value.trim()) {
      paginationRef.current = { page: 0 };
      setSearchPromises([search(value, 0)]);
    } else {
      setSearchPromises([]);
    }
  }, [search]);

  const onBottom = useCallback(() => {
    if (!paginationRef.current)
      paginationRef.current = { page: 0 }
    setSearchPromises(prev => [
      ...prev, 
      //@ts-expect-error
      search(currentValueRef.current, ++paginationRef.current.page)]
    );
  }, [search]);


  return (
    <div>
      <SearchInput onChange={onChange} />
      <ErrorBoundary 
        resetKeys={[currentValueRef.current]} 
        FallbackComponent={CustomError}
      >
        <div>
          {searchPromises.map((promise, index) => (
            <Suspense 
              key={`batch-${index}`} 
              fallback={<LoadingSpinner />}
            >
              <Contents 
                data={promise} 
                isFinal={index + 1 === searchPromises.length} 
                onIntersection={onBottom}
                />
            </Suspense>
          ))}
        </div>
      </ErrorBoundary>

    </div>
  );
}
