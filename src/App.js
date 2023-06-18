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

export const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

export const KEY = '17c07342'

export default function App() {
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleRemoveWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }
  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        )

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies')
        const data = await res.json()
        if (data.Response === 'False') throw new Error('Movie not found')
        setMovies(data.Search)
      } catch (err) {
        console.error(err.message)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    fetchMovies()
  }, [query])

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
