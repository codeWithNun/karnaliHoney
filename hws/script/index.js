document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const appBaseUrl = new URL("./", window.location.href).href;

    function closeMobileMenu() {
        if (navMenu && mobileToggle && navMenu.classList.contains("open")) {
            navMenu.classList.remove("open");
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    function isPageLink(link) {
        const href = link.getAttribute("href");

        if (!href || href === "#" || href.startsWith("tel:") || href.startsWith("mailto:")) {
            return false;
        }

        const url = new URL(href, appBaseUrl);
        return url.origin === window.location.origin && url.pathname.includes("/pages/");
    }

    function fixRelativePaths(container, pageUrl) {
        container.querySelectorAll("[src]").forEach(element => {
            const src = element.getAttribute("src");

            if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("#")) {
                element.setAttribute("src", new URL(src, pageUrl).href);
            }
        });

        container.querySelectorAll("a[href]").forEach(link => {
            const href = link.getAttribute("href");

            if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:")) {
                link.setAttribute("href", new URL(href, pageUrl).href);
            }
        });
    }

    async function loadPage(url) {
        if (!mainContent) return;

        mainContent.innerHTML = '<div class="loader" style="display:block;"></div>';

        try {
            const pageUrl = new URL(url, appBaseUrl);
            const response = await fetch(pageUrl.href);

            if (!response.ok) {
                throw new Error(`Page not found: ${response.status}`);
            }

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const content = document.createElement("div");

            content.innerHTML = doc.body ? doc.body.innerHTML : html;
            fixRelativePaths(content, pageUrl.href);
            mainContent.innerHTML = content.innerHTML;

            document.querySelectorAll(".nav-link").forEach(link => {
                const linkUrl = new URL(link.getAttribute("href"), appBaseUrl);
                link.classList.toggle("active", linkUrl.pathname === pageUrl.pathname);
            });

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            mainContent.innerHTML = `
                <div class="container simple-page">
                    <h1>Page could not load</h1>
                    <p>Please check that the requested file exists in the pages folder.</p>
                </div>
            `;
            console.error("Error loading page:", error);
        }
    }

    document.addEventListener("click", event => {
        const link = event.target.closest("a");

        if (!link || !isPageLink(link)) return;

        event.preventDefault();
        closeMobileMenu();
        loadPage(link.getAttribute("href"));
    });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            if (navMenu.classList.contains("open")) {
                mobileToggle.innerHTML = '<i class="fas fa-xmark"></i>';
            } else {
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

});
