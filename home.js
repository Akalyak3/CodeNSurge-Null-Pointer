const API_KEY = "ea43d3523793442e8c4d59eed72f7313"; 
const url = "https://newsapi.org/v2/everything?q=";
const refreshInterval = 5 * 60 * 1000; 

window.addEventListener("load", () => {
    fetchNews("India"); 
    startLiveNewsUpdates(); 
});

function reload() {
    window.location.reload();
}


async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}&sortBy=publishedAt&_=${new Date().getTime()}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch news. Status: ${res.status}`);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}


function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; 

    if (!articles || !Array.isArray(articles)) {
        console.error("Invalid or missing articles data");
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return; 
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone); 
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open the article in a new tab when clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}


let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id); 
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}


const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query); 
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});


function startLiveNewsUpdates() {
    setInterval(() => {
        const currentQuery = curSelectedNav ? curSelectedNav.id : "India"; // Use current selected query or default to "India"
        fetchNews(currentQuery); // Fetch the latest news
    }, refreshInterval); // Refresh every 5 minutes (or set your own interval)
}
