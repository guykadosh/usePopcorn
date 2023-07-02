import { useEffect, useState } from 'react'
import ErrorMessage from './components/ErrorMessage'
import Loader from './components/Loader'
import NavBar from './components/NavBar'
import Search from './components/Search'
import NumResults from './components/NumResults'
import Main from './components/Main'
import Box from './components/Box'
import MovieList from './components/MovieList'
import MovieDetails from './components/MovieDetails'
import WatchedSummary from './components/WatchedSummary'
import WatchedMovieList from './components/WatchedMovieList'
import { useMovies } from './hooks/useMovies'
import { useLocalStorageState } from './hooks/useLocalStorageState'

export const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

export const KEY = '17c07342'

export default function App() {
  const [query, setQuery] = useState('Harry Potter')
  const [selectedId, setSelectedId] = useState(null)
  const { movies, isLoading, error } = useMovies(query)
  const [watched, setWatched] = useLocalStorageState([], 'watched')

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]))
  }

  function handleRemoveWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
