// Dots animation
window.addEventListener('load', function() {

    const dots = document.querySelectorAll('.data-dot');

    dots.forEach(function(dot, index) {
        setTimeout(function() {
            dot.style.opacity = '1';
        }, 200 + (index * 100));
    });

});