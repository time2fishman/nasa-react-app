import SideBar from "./components/Sidebar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url =
        "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`;
      const today = new Date().toDateString();
      const localKey = `NASA=${today}`;

      // use local storage (cache) if already apiData has already been fetched today
      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        // console.log("Fetched from cache today");
        return;
      }

      // clear cache if apiData has not been fetched today
      localStorage.clear();

      // call api if apiData has NOT already been fetched today
      try {
        const res = await fetch(url);
        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        // console.log("Fetched from api today");
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAPIData();
  }, []);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  return (
    <>
      {data ? (
        <Main data={data} />
      ) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && (
        <SideBar handleToggleModal={handleToggleModal} data={data} />
      )}
      {data && <Footer handleToggleModal={handleToggleModal} data={data} />}
    </>
  );
}

export default App;
