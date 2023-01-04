import React from "react";
import { useEffect } from "react";
import "./App.css";
import Photo from "./Photo";
import { FaSearch } from "react-icons/fa";

const clientAccessKey = process.env.REACT_APP_ACCESS_KEY;

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;


const getStorageTheme = () => { 
  let theme = "light-theme";
  if(localStorage.getItem('theme')) { 
    theme = localStorage.getItem('theme')
  }
  return theme;
}

function App() {
  const[theme, setTheme] = React.useState(getStorageTheme())
  const [loading, setLoading] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState([])
  
  useEffect(() => { 
    localStorage.setItem('theme', theme)
    document.documentElement.className = theme;
  }, [theme] )

  const toggleBtn = () => { 
    if(theme === 'light-theme') { 
      setTheme('dark-theme')
    } else { 
      setTheme('light-theme')
    }
  }

  const fetchImages = async () => {
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) { 
      url = `${searchUrl}?client_id=${clientAccessKey}${urlPage}?${urlQuery}`;
    } else {
      url = `${mainUrl}?client_id=${clientAccessKey}${urlPage}`;
    }
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setPhotos((oldPhotos) => {
        if (query && page === 1) { 
          return data.results;
        }
        else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
         }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return () => {
      window.removeEventListener("scroll", event);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchImages()
    setPage(1)
    
  };
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text" placeholder="search" className="form-input" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
        <button className="btn" onClick={toggleBtn}>Toggle</button>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
