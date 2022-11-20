import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import moment from 'moment';
import { getDiscoverMovies } from '../../modules/ApiRequest';

const useMovies = () => {
  const getUpcommingMovies = useCallback(async () => {
    const result = await getDiscoverMovies({
      releaseDateGte: moment().format('YYYY-MM-DD'),
      releaseDateLte: moment().add(1, 'years').format('YYYY-MM-DD'),
    });
    return result;
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['upcomming-movies'],
    queryFn: getUpcommingMovies,
  });

  const movies = data?.results ?? [];

  return {
    movies,
    isLoading,
  };
};

export default useMovies;
