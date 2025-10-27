import { PaginationResponse } from './query';

export type PopCornerMovieModel = {
  id: string; // Guid
  title: string;
  description: string;
  releaseDate: string; // ISO date string (YYYY-MM-DD)
  duration: number;
  posterUrl: string;
  trailerUrl: string;
  imgUrls: string[];
  directorId: string;
  director: PopCornerArtistModel;
  country: string;
  view: number;
  avgRating: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // --- Navigation (optional relations) ---
  ratings?: PopCornerRatingModel[];
  comments?: PopCornerCommentModel[];
  movieGenres?: PopCornerMovieGenreModel[];
  movieActors?: PopCornerMovieActorModel[];
  credits?: PopCornerMovieCreditModel[];
};

// --- Related Models ---

export type PopCornerRatingModel = {
  id: string;
  userId: string;
  movieId: string;
  score: number;
  createdAt: string;
};

export type PopCornerCommentModel = {
  id: string;
  userId: string;
  movieId: string;
  content: string;
  createdAt: string;
};

export type PopCornerMovieGenreModel = {
  movieId: string;
  genreId: string;
};

export type PopCornerMovieActorModel = {
  movieId: string;
  actorId: string;
  role?: string;
};

export type PopCornerMovieCreditModel = {
  id: string;
  movieId: string;
  name: string;
  role: string;
};

export type PopCornerGenreModel = {
  id: string;
  name: string;
  description: string;
};

export type PopCornerArtistModel = {
  id: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  coutry: string;
  bio: string;
  avatarUrl: string;
};

export type PopCornerPaginationResponse<T> = PaginationResponse<T>;
