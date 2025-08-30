import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchInput, CharacterCard, LoadingSpinner, IntersectionSentinel } from './SearchComponents';
import type { SearchFunction, SearchResult } from './SearchComponents';

interface MainSearchQueryProps {
  search: SearchFunction;
}



export function MainSearchQuery({ search }: MainSearchQueryProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['search', searchTerm],
    queryFn: ({ pageParam = 0 }) => search(searchTerm, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage: SearchResult[], allPages) => {
      return lastPage && lastPage.length > 0 ? allPages.length : undefined;
    },
    enabled: !!searchTerm.trim(),
    staleTime: 1000 * 60 * 5, 
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allResults = useMemo(() => {
    return (data?.pages.flat() || []) as SearchResult[];
  }, [data]);

  return (
    <div>
      <SearchInput 
        onChange={onChange}
        placeholder="Search with React Query..."
      />
      
      {isError && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error instanceof Error ? error.message : 'Something went wrong'}
        </div>
      )}
      
      {isLoading && <LoadingSpinner>Loading initial results...</LoadingSpinner>}
      
      {allResults.length > 0 && (
        <div>
          {allResults.map((result) => (
            <CharacterCard key={result.id} {...result} />
          ))}
        </div>
      )}
      
      {isFetchingNextPage && <LoadingSpinner>Loading more...</LoadingSpinner>}
      
      {hasNextPage && !isFetchingNextPage && (
        <IntersectionSentinel onIntersect={handleLoadMore} />
      )}
      
      {searchTerm && !isLoading && allResults.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No results found for "{searchTerm}"
        </div>
      )}
    </div>
  );
}
