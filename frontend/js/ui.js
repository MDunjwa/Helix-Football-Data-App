// Dots animation
window.addEventListener('load', function() {
    animateCountUp()

    const dots = document.querySelectorAll('.data-dot');

    dots.forEach(function(dot, index) {
        setTimeout(function() {
            dot.style.opacity = '1';
        }, 200 + (index * 100));
    });

});

// Count up
function animateCountUp() {

    const values = document.querySelectorAll(".stat-value[data-end-value]")

    values.forEach(function(element) {

        const target = parseInt(element.getAttribute("data-end-value"));
        const duration = 1200;
        const totalSteps = 40;
        const increment = target/totalSteps;
        let current = 0;
        let currentStep = 0;

        const timer = setInterval(function() {
            currentStep ++;
            current = Math.round(increment * currentStep);

            // Clamping for overshoot when roundinh 
            element.textContent = Math.min(current, target);

            if (currentStep >= totalSteps) {
                clearInterval(timer);
            }
        }, duration/totalSteps);

    });
}