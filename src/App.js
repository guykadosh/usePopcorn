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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('Harry Potter')
  const [selectedId, setSelectedId] = useState(null)

  // const [watched, setWatched] = useState([])
  const [watched, setWatched] = useState(function () {
    const storeValue = localStorage.getItem('watched') || []
    return JSON.parse(storeValue)
  })
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

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  useEffect(() => {
    const controller = new AbortController()
    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        )

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies')
        const data = await res.json()
        if (data.Response === 'False') throw new Error('Movie not found')
        setMovies(data.Search)
        setError('')
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log(err.message)
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    handleCloseMovie()
    fetchMovies()

    return function () {
      controller.abort()
    }
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
