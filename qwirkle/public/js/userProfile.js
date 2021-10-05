
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

