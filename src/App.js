import React from "react";
import { useEffect } from "react";
import "./App.css";
import Photo from "./Photo";
import { FaSearch } from "react-icons/fa";

const clientAccessKey =process.env.REACT_APP_ACCESS_KEY;

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);



  const fetchImages = async () => {
    let url;
    url = `${mainUrl}?client_id=${clientAccessKey}`;
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setPhotos(data);
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);


  const handleSubmit = (e) => { 
    e.preventDefault();
    console.log('hello');
  }
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text" placeholder="search" className="form-input" />
          <button type="submit" className="submit-btn" onClick={handleSubmit}><FaSearch/></button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => { 
            const { id } = image;
            console.log(image);
              return <Photo key={id} {...image} />
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
