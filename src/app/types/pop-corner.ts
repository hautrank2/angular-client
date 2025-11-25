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
  view: string;
  avgRating: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // --- Navigation (optional relations) ---
  ratings: PopCornerRatingModel[];
  comments: PopCornerCommentModel[];
  credits: PopCornerMovieCreditModel[];

  genreIds: string[];
  genres: PopCornerGenreModel[];
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
  movieId: string;
  artistId: string;
  artist: PopCornerArtistModel;
  creditRoleId: string;
  creditRole: PopCornerCreditRole;
  characterName: string;
  order: number;
  createdAt: string;
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
  country: string;
  bio: string;
  avatarUrl: string;
};

export type PopCornerCreditRole = {
  id: number;
  name: string;
  description: string;
};

export type PopCornerUserModel = {};
export type PopCornerPaginationResponse<T> = PaginationResponse<T>;
