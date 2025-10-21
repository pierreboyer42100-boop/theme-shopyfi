// Interactions globales du thème Flame Box
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.querySelector('.nav-toggle');
    var navList = document.getElementById('MainNav');
    if (toggle && navList) {
      toggle.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        navList.classList.toggle('active');
      });
    }
  });
})();
