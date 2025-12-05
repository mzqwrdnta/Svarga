// Togle
function toggleMenu() {
  document.querySelector('nav').classList.toggle('show');
}

document.addEventListener('click', function (event) {
  const nav = document.querySelector('nav');
  const toggleBtn = document.querySelector('.toggle');

  const isClickInsideNav = nav.contains(event.target);
  const isClickOnToggle = toggleBtn.contains(event.target);

  if (!isClickInsideNav && !isClickOnToggle) {
    nav.classList.remove('show');
  }
});
