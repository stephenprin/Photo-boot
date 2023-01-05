import React from "react";
import "./App.css";
import Photo from "./Photo";
import { FaSearch } from "react-icons/fa";
import { useGlobalContext } from "./context";




function App() {
  
  const{theme,
  
    loading,
    setLoading,
    photos,
   
    page,
  
    query,
    setQuery,
    toggleBtn,
    handleSubmit}=useGlobalContext()
  
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
        <button className="btn" onClick={toggleBtn}>
          Toggle
        </button>
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
