import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { getDiscoverMovies } from '../../modules/ApiRequest';
import { Movie } from '../../types';

const useMovies = () => {
  const getUpcommingMovies = useCallback(async ({ pageParam = 1 }) => {
    const result = await getDiscoverMovies({
      releaseDateGte: moment().format('YYYY-MM-DD'),
      releaseDateLte: moment().add(1, 'years').format('YYYY-MM-DD'),
      page: pageParam,
    });
    return result;
  }, []);

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['upcomming-movies'],
      queryFn: getUpcommingMovies,
      getNextPageParam: lastPage => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    });

  const movies = useMemo(() => {
    return data?.pages.reduce<Movie[]>((allMovies, page) => {
      return allMovies.concat(page.results);
    }, []);
  }, [data]);

  const loadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    movies,
    isLoading,
    loadMore,
    canLoadMore: hasNextPage,
    refresh,
  };
};

export default useMovies;
