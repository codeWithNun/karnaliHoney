// scrool garda header style change garne
window.addEventListener("scroll", () => {
    const header = document.querySelector(".main-header");
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("scroll-shadow");
    } else {
        header.classList.remove("scroll-shadow");
    }
});
