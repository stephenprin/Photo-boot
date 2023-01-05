import React, {useEffect} from "react";



const clientAccessKey = process.env.REACT_APP_ACCESS_KEY;

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

const AppContext = React.createContext();
const getStorageTheme = () => {
    let theme = "light-theme";
    if (localStorage.getItem("theme")) {
      theme = localStorage.getItem("theme");
    }
    return theme;
};

export const AppProvider = ({ children }) => { 

    const [theme, setTheme] = React.useState(getStorageTheme());
  const [loading, setLoading] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [query, setQuery] = React.useState('');

    
    

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.className = theme;
      }, [theme]);
    
      const toggleBtn = () => {
        if (theme === "light-theme") {
          setTheme("dark-theme");
        } else {
          setTheme("light-theme");
        }
      };
    
      const fetchImages = async () => {
        let url;
        const urlPage = `&page=${page}`;
        const urlQuery = `&query=${query}`;
    
        if (query) {
          url = `${searchUrl}?client_id=${clientAccessKey}${urlPage}${urlQuery}`;
        } else {
          url = `${mainUrl}?client_id=${clientAccessKey}${urlPage}`;
        }
        try {
          setLoading(true);
          const response = await fetch(url);
          const data = await response.json();
       
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
        fetchImages();
         setPage(1)
      };

    return (
        <AppContext.Provider value={{
            theme,
            setTheme,
            loading,
            setLoading,
            photos,
            setPhotos,
            page,
            setPage,
            query,
            setQuery,
            toggleBtn,
            handleSubmit

        }}>{children}</AppContext.Provider>
    );
};
    

export const useGlobalContext = () => { 
    return React.useContext(AppContext);
}