const profileUpdateForm = document.getElementById('update-profile');

const editProfile = document.getElementById('edit-user-profile');
editProfile.addEventListener('click', function(e) {
  if(profileUpdateForm.style.display == 'block'){
    profileUpdateForm.style.display = 'none';
    editProfile.innerText='Edit Profile';
  } else {
    profileUpdateForm.style.display = 'block';
    editProfile.innerText='Cancel';
  }
});


//need to fetch playerRecs from dashboard view 
/*
const createPageNav = (data)=>{
  let totalNumberOfItems = data.length;
  let itemsPerPage = 10;
  let lastPage = (totalNumberOfItems % itemsPerPage == 0) ? totalNumberOfItems / itemsPerPage : (totalNumberOfItems / itemsPerPage) + totalNumberOfItems % itemsPerPage;

  let paginationNav = document.getElementById('gameRecsPagination');
  
  let prevPage = document.createElement('li');
  prevPage.innerHTML = '<a class="page-link" href="#">Previous</a>';

  paginationNav.appendChild(prevPage);

  for (let i = 0;i<lastPage;i++){
    let page = i+1;
    let pageNumber = document.createElement('li');
    pageNumber.innerHTML = '<a class="page-link" href="#" onClick = "changePage(playerRecs,'+page+')">'+ page +'</a>';
    paginationNav.appendChild(pageNumber);
  }


  let nextPage = document.createElement('li');
  nextPage.innerHTML = '<a class="page-link" href="#">Next</a>'
}*/
