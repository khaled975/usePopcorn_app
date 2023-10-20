import { useEffect, useRef, useState } from "react";
import Star from "./StarCom";
import useFetch from "./useFetch";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "226061e8";

export default function App() {
  const [selectedID, setSelectedID] = useState(null);
  const [query, setQuery] = useState("");

  // RETURN VALUE FROM FUNCTION AND SET IT TO setWatched STATE
  const [watched, setWatched] = useState(function () {
    const storedMovies = localStorage.getItem("watched");
    return JSON.parse(storedMovies) || [];
  });

  // FETCH MOVIES USING useFetch
  const { movies, isLoading, error } = useFetch(query);

  // HANDEL SELECT MOVIE FROM MOVIES LIST
  function handelSelectMovie(ID) {
    setSelectedID(ID);
  }

  // HANDEL ADDING MOVIE TO WATCHED LIST
  function handelAddMovie(watchedMovie) {
    setWatched((list) => [...list, watchedMovie]);
    handelCloseMovie();
  }

  // HANDEL CLOSE SELECTED MOVIE
  function handelCloseMovie() {
    setSelectedID(null);
  }

  // HANDEL DELETE MOVIE FROM WATCHED LIST
  function HandelDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // SET WATCHED MOVIES IN LOCAL STORAGE
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <Navbar movies={movies} query={query} setQuery={setQuery} />
      <Main>
        <Box>
          <MoviesList
            movies={movies}
            errorMsg={error}
            onSelectMovie={handelSelectMovie}
            isLoading={isLoading}
          />
        </Box>
        <Box>
          {selectedID ? (
            <SelectedMovie
              selectedID={selectedID}
              onCloseMovie={handelCloseMovie}
              isLoading={isLoading}
              onAddMovie={handelAddMovie}
              watched={watched}
            />
          ) : (
            <WatchedList
              watched={watched}
              onHandelDeleteMovie={HandelDeleteMovie}
            />
          )}
        </Box>
      </Main>
    </>
  );
}

function Navbar({ movies, query, setQuery }) {
  const elRef = useRef();
  useEffect(function () {
    elRef.current.focus();
  }, []);

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={elRef}
      />
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MoviesList({ movies, errorMsg, onSelectMovie, isLoading }) {
  return (
    <>
      {isLoading && <Loader />}
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {!isLoading && !errorMsg && (
        <ul className="list list-movies">
          {movies?.map((movie) => (
            <Movie
              movie={movie}
              key={movie.imdbID}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovie({ onCloseMovie, selectedID, onAddMovie, watched }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);

  const watchedMovieRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  useEffect(() => {
    async function getSelectedMovie() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedID}&apikey=${KEY}`
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        setSelectedMovie(data);

        // if (data.Response === "False") {
        //   throw new Error("Movie Not Found!");
        // }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getSelectedMovie();
  }, [selectedID, watchedMovieRating]);
  const {
    Poster,
    Title,
    Released,
    imdbRating,
    Plot,
    Runtime,
    Genre,
    Actors,
    Director,
    imdbID,
  } = selectedMovie;

  function addNewMovie() {
    const newWatchedMovie = {
      Poster,
      Title,
      Released,
      imdbRating,
      Plot,
      runtime: Number(Runtime.split(" ").at(0)),
      Genre,
      Actors,
      Director,
      userRating,
      imdbID,
    };
    onAddMovie(newWatchedMovie);
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={Poster} alt={`Poster of ${Title} movie`} />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You rated this movie with {watchedMovieRating}🌟</p>
              ) : (
                <>
                  <Star count={10} onSetRating={setUserRating} />
                  {userRating && (
                    <button className="btn-add" onClick={addNewMovie}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </div>
      )}
    </>
  );
}
function WatchedList({ watched, onHandelDeleteMovie }) {
  return (
    <>
      <WatchedMoviesSummery watched={watched} />
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie
            movie={movie}
            key={movie.imdbID}
            onHandelDeleteMovie={onHandelDeleteMovie}
          />
        ))}
      </ul>
    </>
  );
}

function WatchedMoviesSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Number(avgImdbRating).toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Number(avgUserRating).toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Number(avgRuntime).toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onHandelDeleteMovie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onHandelDeleteMovie(movie.imdbID)}
      >
        &times;
      </button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {children}
    </button>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      🚨 <span>{message}</span>
    </p>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </Button>
      {isOpen && children}
    </div>
  );
}
