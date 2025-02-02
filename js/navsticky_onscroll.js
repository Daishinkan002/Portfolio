document.addEventListener("DOMContentLoaded", function() {
    window.onscroll = function() {
        stickyNavbar();
    };

    function stickyNavbar() {
        var navbar = document.querySelector("nav");
        var header = document.querySelector("header");

        // Check if navbar and header exist to avoid errors if not found
        if (!navbar || !header) {
            console.error("Navbar or header element not found!");
            return;
        }

        // Get the offset position of the header
        var headerHeight = header.offsetHeight;

        // If the page is scrolled past the header, add the sticky class to the navbar
        if (window.pageYOffset > headerHeight) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }
});