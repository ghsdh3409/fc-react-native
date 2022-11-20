export type RootStackParamList = {
  Movies: undefined;
};

export interface Movie {
  title: string;
  originalTitle: string;
  releaseDate: string;
  overview: string;
  posterUrl: string | null;
}
