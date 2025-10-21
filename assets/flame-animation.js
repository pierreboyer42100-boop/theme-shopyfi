// Animation douce de halo pour les éléments flamboyants
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var flameElements = document.querySelectorAll('.btn-primary, .badge-glow, .promo-bar');
    flameElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        el.classList.add('flame-active');
      });
      el.addEventListener('mouseleave', function() {
        el.classList.remove('flame-active');
      });
    });
  });
})();
