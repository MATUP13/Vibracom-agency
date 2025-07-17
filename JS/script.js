/* Ajoutez ces règles */
.testimonial {
    transition: opacity 0.5s ease;
    opacity: 0;
    pointer-events: none;
}
.testimonial.active {
    opacity: 1;
    pointer-events: auto;
}

[class*="animate"] {
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.6s ease;
}
.animate {
    transform: translateY(0);
    opacity: 1;
}
