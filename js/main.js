//!DATA
let moviesData = [];
const favoriteData = JSON.parse(localStorage.getItem('favoriteData')) || [];
const moviesList = document.querySelector('.movies-list');
const moviesListLoader = document.querySelector('.movies-list__loader');
const favoriteList = document.querySelector('.favorite-list__content');


//!GET MOVIES
const getMovies = (movieId = false) => {
	const url = `http://my-json-server.typicode.com/moviedb-tech/movies/list/${movieId ? movieId : ''}`
	return fetch(url)
		.then(response => {
			if(response.ok){
				return response.json();
			}else{
				throw new Error(response.status);
			}
		})
		.then(data => data)
		.catch(error => alert(`Error ${error}: please try later...`))
}


//!REFRESH MARKS
const refreshMarks = () => {
	const moviesMarks = document.querySelectorAll('.movie__mark');

	moviesMarks.forEach(mark => {
		if(favoriteData.indexOf(mark.dataset.id) !== -1){
			mark.dataset.favorite = true;
		}else{
			mark.dataset.favorite = false;
		}
	})
}


//*!ADD/DELETE FAVORITE MOVIE  
const toggleFavorite = (mark) =>{
	const index = favoriteData.indexOf(mark.dataset.id);

	if (index === -1) {
		//add to favoriteData
		favoriteData.push(mark.dataset.id);

		//add to favorite list
		const favoriteListItem = document.createElement('li');
		favoriteListItem.id = mark.dataset.id;
		favoriteListItem.innerHTML = `${mark.dataset.name}<button class="mark__delete btn--close"></button>`;
		favoriteList.append(favoriteListItem);
		console.log('item has been added');
	} else {
		//delete from favoriteData
		favoriteData.splice(index, 1);

		//delete from favorite list
		for(let i = 0; i < favoriteList.children.length; i++){
			if(favoriteList.children[i].id === mark.dataset.id){
				favoriteList.children[i].remove();
			}
		}
		console.log('item has been removed');
	}
	//rewrite storage
	localStorage.setItem('favoriteData', JSON.stringify(favoriteData));
	//refresh marks
	refreshMarks();
}


//!DELETE MOVIE FROM FAVORITE LIST
favoriteList.addEventListener('click', e => {
	if(e.target.classList.contains('mark__delete')){
		const index = favoriteData.indexOf(e.target.parentNode.id);

		//delete from favoriteData
		favoriteData.splice(index, 1);
		//delete list item
		e.target.parentNode.remove();

		//rewrite storage
		localStorage.setItem('favoriteData', JSON.stringify(favoriteData));
		//refresh marks
		refreshMarks();
	}
})


//!POPUP
const popupWrapper= document.querySelector('.popup-wrapper');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup__content');
const popupClose = document.querySelector('.popup__close');
const popupError = document.querySelector('.popup__error');
const popupLoader = document.querySelector('.popup__loader');

//hide popup
popupWrapper.addEventListener('click', () => popupWrapper.classList.add('hidden'));
popupClose.addEventListener('click', () => popupWrapper.classList.add('hidden'));
//add listeren to prevent spread on clicking loginWrapper content
popup.addEventListener('click', e => {
	if(e.target.classList.contains('movie__mark')){
		toggleFavorite(e.target);
		e.stopPropagation();
	}else{
		e.stopPropagation();
	}

});

//fill movie popup
const fillPopup = (movie) =>{
	const favorite = favoriteData.indexOf(`${movie.id}`) === -1?
										false :
										true;

	popupContent.innerHTML = `
		<div class="content__part content__part--left">
			<img class="movie__img" src="${movie.img}" alt="${movie.name}">
			<div class="movie__mark" data-favorite="${favorite}" data-id="${movie.id}" data-name="${movie.name}"></div>
			<div class="movie__year"><b>Year:</b> ${movie.year}</div>
			<div class="movie__genres"><b>Genges:</b> ${movie.genres.join(', ')}</div>
		</div>
		<div class="content__part content__part--right">
			<div class="movie__name">${movie.name}</div>
			<div class="movie__description">${movie.description}</div>
			<div class="movie__director"><b>Director:</b> ${movie.director}</div>
			<div class="movie__stars"><b>Starring:</b> ${movie.starring.join(', ')}</div>
		</div>`;
}


//!MOVIES LIST
const createMovies = () => {
	//handle add to favorite || open popup
	moviesList.addEventListener('click', e => {
		if(e.target.classList.contains('movie__mark')){
			toggleFavorite(e.target);
		}else{
			if(e.target.parentNode.id || e.target.parentNode.parentNode.id){
				let movieId = e.target.parentNode.id || e.target.parentNode.parentNode.id;
				popupContent.innerHTML = '';
				//show popup
				popupLoader.classList.remove('hidden');
				popupWrapper.classList.remove('hidden');
		
				getMovies(movieId)
					.then(movieData => {
						if(movieData){
							fillPopup(movieData);
		
							popupLoader.classList.add('hidden');
							popupContent.classList.remove('hidden');
		
						}
					})
			}
		}
	});

	//fill movies list
	getMovies()
		.then(data => {
			if(data && data.length > 0){
				moviesData = [...data];
				const moviesBox = document.createDocumentFragment();
				const favoritesBox = document.createDocumentFragment();

				moviesData.forEach(movie => {
					//fill movies list
					const favorite = favoriteData.indexOf(`${movie.id}`) === -1?
														false :
														true;

					const movieItem = document.createElement('article');
					movieItem.classList.add('movies-list__movie', 'movie');
					movieItem.id = movie.id;
					movieItem.innerHTML = `<img class="movie__img" src="${movie.img}" alt="${movie.name}">
																<div class="movie__info">
																	<h2 class="movie__name text--center">${movie.name}</h2>
																	<div class="movie__year text--grey text--center">${movie.year}</div>
																	<div class="movie__description">${movie.description}</div>
																	<div class="movie__genres"><b>Genges:</b> ${movie.genres.join(', ')}</div>
																</div>
																<div class="movie__mark" data-favorite="${favorite}" data-id="${movie.id}" data-name="${movie.name}"></div>`;
					moviesBox.appendChild(movieItem);

					//fill favorites list
					if(favoriteData.indexOf(`${movie.id}`) !== -1){
						const favoriteListItem = document.createElement('li');
						favoriteListItem.id = movie.id;
						favoriteListItem.innerHTML = `${movie.name}<button class="mark__delete btn--close"></bu>`;
						favoritesBox.append(favoriteListItem);
					}
				});

				moviesListLoader.classList.add('hidden');

				moviesList.append(moviesBox);
				favoriteList.append(favoritesBox);
			}
		})
}

createMovies();


//!NAVIGATION
const menu = document.querySelector('.header_menu');
const favoriteListWrapper = document.querySelector('.favorite-list');

menu.addEventListener('click', (e)=>{
	if(e.target.classList.contains('menu__item--favorite')){
		e.target.dataset.show === 'true' ?
			favoriteListWrapper.dataset.show = 'false' :
			favoriteListWrapper.dataset.show = 'true';
	}else if(e.target.classList.contains('view__item--cards')){
		moviesList.dataset.style = 'cards';
	}else if(e.target.classList.contains('view__item--list')){
		moviesList.dataset.style = 'list';
	}
	
})

const favoriteListWrapperClose = document.querySelector('.favorite-list__close');
favoriteListWrapperClose.addEventListener('click', ()=>{
	favoriteListWrapperClose.parentNode.dataset.show = 'false';
})


