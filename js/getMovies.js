//!GET MOVIES
const getMovies = (movieId = false) => {
	const url = `https://my-json-server.typicode.com/moviedb-tech/movies/list/${movieId ? movieId : ''}`
	return fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(response.status);
			}
		})
		.then(data => data)
		.catch(error => alert(`Error ${error}: please try later...`))
};

export default getMovies;
