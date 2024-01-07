import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Search = () => {
  const router = useRouter();

  const [searchBar, setSearchBar] = useState<string>("");
// const [buttonDisable, setButtonDisable] = useState<boolean>(true);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [distinctState, setDistinctState] = useState([]);
  const [distinctCity, setDistinctCity] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [stateElementSelected, setStateElementSelected] = useState('');
  const [cityElementSelected, setCityElementSelected] = useState('');

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      // No need to automatically submit the search text here
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchBar]);

  // handle search bar
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const searchData = await axios.post(
        'http://127.0.0.1:50000/auth/search',
        { searchBar, cityElementSelected, stateElementSelected },
        { withCredentials: true }
      );
      setSearchResults(searchData.data?.data);
      setSearchBar('');
    } catch (err) {
      console.error(err);
    }
  };

  // handle display city options
  const handleStates = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:50000/auth/displayState',
      );
      setDistinctState(response.data.data);
    } catch (error) {
      console.error('Error fetching distinct states:', error);
    }
  };

  // handle display city options
  const handleCity = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:50000/auth/displayCity',
      );
      setDistinctCity(response.data.data);
    } catch (error) {
      console.error('Error fetching distinct cities:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //setButtonDisable(searchBar.length === 0 || cityElementSelected.length > 0 || stateElementSelected.length > 0);
      await handleCity();
      await handleStates();
      setDataFetched(true);
    };
    if (!dataFetched) {
      fetchData();
    }
  }, [searchBar, distinctCity, distinctState]);

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center mb-4 text-black">Search Email</h1>
      <form onSubmit={handleSearch} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <input
            className="w-full rounded-md border-0 focus:outline-none focus:border-gray-500"
            type="text"
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
            placeholder="Enter email search"
          />
          <button
            className="p-2 w-32 rounded-2xl text-white"
            style={{ backgroundColor: isMouseOver ? '#A9A9A9' : '#000000' }}
            onMouseOver={() => setIsMouseOver(true)}
            onMouseOut={() => setIsMouseOver(false)}
          >
            Search
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <span className="font-bold text-gray-600">All Emails </span>
            <input type="checkbox" className="text-gray-400"/>
          </div>

          <div>
          <span className="font-bold text-gray-600">State </span>
          <select
            className="w-20 rounded-md border-0 focus:outline-none focus:border-blue-500 text-gray-400"
            value={stateElementSelected}
            onChange={(e) => setStateElementSelected(e.target.value)}
          >
            <option value="" disabled>Select State</option>
            <option value="">None</option>
             {distinctState.map((state, index) => (
                <option key={index} value={state.State}>
                 {state.State}
                </option>
             ))}
          </select>
          </div>

          <div>
          <span className="font-bold text-gray-600">City </span>
          <select
            className="w-20 rounded-md border-0 focus:outline-none focus:border-blue-500 text-gray-400"
            value={cityElementSelected}
            onChange={(e) => setCityElementSelected(e.target.value)}
          >
            <option value="" disabled>Select City</option>
            <option value="">None</option>
            {distinctCity.map((city, index) => (
              <option key={index} value={city.City}>
                {city.City}
              </option>
            ))}
          </select>
          </div>
        </div>
      </form>

      {searchResults?.length > 0 && (
        <div className="mt-10 max-w-4xl mx-auto">
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                Name: {result.Name}, Position: {result.Position}, Email: {result.Email}
              </li>
            ))}
          </ul>
        </div>
      )}

      {
        
      }
    </div>
  );
};

export default Search;