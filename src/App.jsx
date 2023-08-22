import { useCallback, useRef } from 'react';
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import { useState } from 'react';
import { useEffect } from 'react';
import debounce from 'just-debounce-it';

const useSearch = () => {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return;
    }

    if (search === '') {
      setError('No se puede buscar una pelicula vacía')
      return;
    }
    setError(null);
  }, [search])

  return {
    search,
    error,
    updateSearch,
  }
}


function App() {
  const [sort, setSort] = useState(false)
  const { search, error, updateSearch } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });
  const inputRef = useRef();


  const debouncedGetMovies = useCallback(
    debounce(search => {
    getMovies({ search })
  }, 300),[getMovies])
  

  const handleChange = (event) => {
    const newSearch = event.target.value;
    // if (newQuery.startsWith(' ')) return
    updateSearch(newSearch);
    debouncedGetMovies(newSearch)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // const value = inputRef.current.value
    // console.log(value);
    // const {title} = Object.fromEntries(new window.FormData(event.target));
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  return (
    <div className='page'>

      <h1>Search Movies</h1>

      <header>
        <form className='form' onSubmit={handleSubmit}>
          <input style={{
            border: '1px solid transparent',
            borderColor: error ? 'red' : 'transparent'
          }} onChange={handleChange} value={search} name='title' ref={inputRef} type='text' placeholder='Star Wars, Matrix' />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }

      </main>
    </div>
  )
}

export default App
