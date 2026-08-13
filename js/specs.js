// JavaScript Document
$(document).ready(function(){
	$("#totop-placeholder").load("html-include/totop.html");
});


document.addEventListener("DOMContentLoaded", () => {
	// Get the filename without .html
	const page = window.location.pathname.split("/").pop().replace(".html", "");

	fetch("js/list.json")
		.then(res => res.json())
		.then(data => {
			const specs = data[page];
			if (!specs) {
				document.getElementById("specs").innerHTML = "No specs found";
				return;
			}

			document.getElementById("specs").innerHTML = `
				<h2>${specs.title}</h2>
				<p><strong>${specs.type}</strong></p>
				${specs.collaborator ? `<p><strong>Collaborator:</strong> ${specs.collaborator}</p>` : ""}
				${specs.instructor ? `<p><strong>Instructor:</strong> ${specs.instructor}</p>` : ""}
				${specs.typology ? `<p><strong>Typology:</strong> ${specs.typology}</p>` : ""}
				${specs.site? `<p><strong>Site:</strong> ${specs.site}</p>`: ""}
				${specs.recognition? `<p><strong>Recognition:</strong> ${specs.recognition}</p>`: ""}			
				${specs.timeline? `<p><strong>Timeline:</strong> ${specs.timeline}</p>`: ""}			

			`;
		});
});
