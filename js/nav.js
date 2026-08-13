// JavaScript Document
$(document).ready(function(){

    // 1. Load the header and pass a callback function after the HTML is fully loaded
    $("#main-header").load("html-include/nav.html #top", function() {
        
        // 2. Attach the event listener using jQuery delegation or direct binding
        $("#title-link").on("click", function(e) {
            // Define mobile breakpoint
            if (window.innerWidth < 768) {
                e.preventDefault();
                window.location.href = 'index.html#contents';
            }
        });

    });

    // Load the footer independently
    $("#footer").load("html-include/nav.html #footer");

});