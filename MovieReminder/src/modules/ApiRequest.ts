import axios from 'axios';
import moment from 'moment';
import { Movie } from '../types';

const API_KEY = '782063ec8e486dcff5f85a3ea57cc121';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const getImageUrl = (path: string | null) =>
  path != null ? `${IMG_BASE_URL}/${path}` : null;

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: 'ko-KR',
  },
});

interface MovieResponse {
  poster_path: string | null;
  overview: string;
  release_date: string;
  id: number;
  original_title: string;
  title: string;
}

interface GetDiscoverMoviesResponse {
  page: number;
  results: MovieResponse[];
  total_results: number;
  total_pages: number;
}

interface GetDiscoverMoviesParams {
  releaseDateGte?: string;
  releaseDateLte?: string;
  page?: number;
}

export const getDiscoverMovies = async ({
  releaseDateGte,
  releaseDateLte,
  page,
}: GetDiscoverMoviesParams) => {
  // 개봉 예정 영화
  const response = await instance.get<GetDiscoverMoviesResponse>(
    'discover/movie',
    {
      params: {
        ['release_date.gte']: releaseDateGte,
        ['release_date.lte']: releaseDateLte,
        region: 'KR',
        page: page,
      },
    },
  );

  const movies: Movie[] = response.data.results.map<Movie>(r => ({
    id: r.id,
    title: r.title,
    originalTitle: r.original_title,
    releaseDate: r.release_date,
    overview: r.overview,
    posterUrl:
      r.poster_path != null ? `${IMG_BASE_URL}/${r.poster_path}` : null,
  }));

  return {
    page: response.data.page,
    results: movies,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
  };
};

interface GetMovieDetailsParams {
  id: number;
}

interface GetMovieResponse {
  id: number;
  genres: {
    id: number;
    name: string;
  };
  title: string;
  original_title: string;
  overview: string | null;
  poster_path: string | null;
  release_date: string;
  runtime: string | null;
  credits: GetCreditsResponse;
  videos: GetVideosResponse;
  release_dates: GetReleaseDatesResponse;
}

interface GetCreditsResponse {
  cast: {
    id: number;
    known_for_department: string;
    name: string;
    profile_path: string | null;
    character: string;
  }[];
  crew: {
    id: number;
    known_for_department: string;
    name: string;
    profile_path: string | null;
    job: string;
  }[];
}

interface GetVideosResponse {
  results: {
    name: string;
    key: string;
    site: string;
    type: string;
    id: string;
  }[];
}

interface GetReleaseDatesResponse {
  id: number;
  results: {
    iso_3166_1: string;
    release_dates: {
      certification: string;
      iso_639_1: string;
      release_date: string;
      type: number;
      note: string;
    }[];
  }[];
}

export const getMovieDetails = async ({ id }: GetMovieDetailsParams) => {
  const { data: movie } = await instance.get<GetMovieResponse>(`movie/${id}`, {
    params: {
      append_to_response: 'credits,videos,release_dates',
    },
  });

  const releaseDate = (() => {
    const releaseDateKR = movie.release_dates.results.find(
      r => r.iso_3166_1 === 'KR',
    )?.release_dates[0].release_date;

    if (releaseDateKR != null) {
      return moment(releaseDateKR).format('YYYY-MM-DD');
    }
    return movie.release_date;
  })();

  return {
    id: movie.id,
    genres: movie.genres,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterUrl: getImageUrl(movie.poster_path),
    releaseDate: releaseDate,
    runtime: movie.runtime,
    casts: movie.credits.cast.map(cast => ({
      id: cast.id,
      knownForDepartment: cast.known_for_department,
      name: cast.name,
      profileUrl: getImageUrl(cast.profile_path),
      character: cast.character,
    })),
    crews: movie.credits.crew.map(crew => ({
      id: crew.id,
      knownForDepartment: crew.known_for_department,
      name: crew.name,
      profileUrl: getImageUrl(crew.profile_path),
      job: crew.job,
    })),
    videos: movie.videos.results.map(video => ({
      name: video.name,
      key: video.key,
      site: video.site,
      type: video.type,
      id: video.id,
    })),
  };
};
