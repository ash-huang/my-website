document.addEventListener("DOMContentLoaded", () => {
	const zoom = 2.5;

	document.querySelectorAll(".img-wrapper").forEach(wrapper => {
	const img = wrapper.querySelector(".zoom-img");
	const lens = wrapper.querySelector(".lens");

	img.addEventListener("mouseenter", () => {
		const rect = img.getBoundingClientRect();
		lens.style.display = "block";
		lens.style.backgroundImage = `url(${img.src})`;
		lens.style.backgroundSize =
		`${rect.width * zoom}px ${rect.height * zoom}px`;
	});

	img.addEventListener("mouseleave", () => {
		lens.style.display = "none";
	});

	img.addEventListener("mousemove", (e) => {
		const rect = img.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		lens.style.left = `${x - lens.offsetWidth / 2}px`;
		lens.style.top = `${y - lens.offsetHeight / 2}px`;

		lens.style.backgroundPosition =
		`-${x * zoom - lens.offsetWidth / 2}px -${y * zoom - lens.offsetHeight / 2}px`;
	});
	});
});
