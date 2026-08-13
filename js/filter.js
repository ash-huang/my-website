// JavaScript Document
$(document).ready(function() {

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    var params = new URLSearchParams(window.location.search);
    var activeTag = params.get("tag");
    
    // Global variable to cache the JSON data so we only download it ONCE
    var projectData = null;

    if (activeTag) {
        var contentsOffset = $("#contents").offset().top;
        window.scrollTo(0, contentsOffset);
        $("body").removeClass("loading");
    }

    // Load the external components
    $("#filter-nav").load("html-include/filter.html", function() {
        // Update active class on initial load
        updateFilterUI(activeTag);
    });

    $(document).on('click', '.enter-button', function() {
        $('html, body').animate({ scrollTop: $("#contents").offset().top }, 1000); 
    });

    // 1. INITIAL LOAD: Fetch data and render
    $.getJSON('js/list.json', function(data) {
        projectData = data; // Cache the data in memory
        renderProjects(activeTag); // Render immediately
        
        if (activeTag) {
            setTimeout(function() {
                $('html, body').scrollTop($("#contents").offset().top);
            }, 100); 
        }
    });

    // 2. INTERCEPT FILTER CLICKS: Stop the page reload
    $(document).on('click', 'nav.filter-nav a', function(e) {
        e.preventDefault(); // STOP the browser from reloading the page
        
        var href = $(this).attr('href');
        var newParams = new URLSearchParams(href.split('?')[1] || "");
        var newTag = newParams.get("tag") || "all";

        // Update the URL in the browser without reloading
        window.history.pushState({tag: newTag}, '', href);
        
        // Update the UI and instantly re-render from memory
        updateFilterUI(newTag);
        renderProjects(newTag);
    });

    // Handle the browser's Back/Forward buttons smoothly
    $(window).on('popstate', function() {
        var currentParams = new URLSearchParams(window.location.search);
        var currentTag = currentParams.get("tag") || "all";
        updateFilterUI(currentTag);
        renderProjects(currentTag);
    });

    // 3. RENDER LOGIC: Purely from memory, zero network lag
    function renderProjects(tag) {
        if (!projectData) return; // Safeguard if data hasn't loaded yet

        var finalHTML = ''; 

        $.each(projectData, function(key, en) { 
            var itemCategories = en['分類'].split(',').map(function(item) {
                return item.trim();
            });
            
            if (!tag || tag === "all" || itemCategories.includes(tag)) {
                var html = '<a class="box" href="' + (en['連結'] || '') + '">';
                html +='<div class="imgbox">';
                // ADDED loading="lazy" to stop network throttling on images you can't even see yet
                html +='<img src="'+en['圖片']+'" loading="lazy">';
                html +='</div>';
                html +='<h3>'+en['title']+'</h3>';

                if (en['site']) {
                  html += '<p>' + en['site'] + '</p>';
                }
                
                var displayTags = itemCategories.map(function(t) { return '#' + t; }).join(' ');
                html += '<p class="tag">' + displayTags + '</p>';
                html +='</a>';
                
                finalHTML += html;
            }
        });

        // Fast render
        $("#project-list").hide().html(finalHTML).fadeIn(300);
    }

    // Helper function to handle the background color switching
    function updateFilterUI(tag) {
        $("nav.filter-nav li").removeClass("ch_bg");
        if (!tag || tag === "all") {
            $("nav.filter-nav li[data-target='all']").addClass("ch_bg");
        } else {
            $("nav.filter-nav li[data-target='" + tag + "']").addClass("ch_bg");
        }
    }

    // Keep your detail page routing
    $(document).on('click', '.box', function(e) {
        // Only redirect if it's not a standard link click
        if (!$(this).attr('href')) {
            var link = $(this).data('link');
            if (link) window.location.href = link;
        }
    });
});