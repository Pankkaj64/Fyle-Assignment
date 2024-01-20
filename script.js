const subj = document.getElementById("subj");
const repositoriesheading = document.getElementById("repositories");
const paginationheading = document.getElementById("pagination");
const user = document.getElementById("user");

async function fetchRepositories() {
  const username = document.getElementById("username").value;
  if (!username) {
    alert("Please enter a GitHub username");
    return;
  }

  subj.style.display = "block";
  user.innerHTML = "";
  repositoriesheading.innerHTML = "";
  paginationheading.innerHTML = "";

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const data = await response.json();

    if (data.length === 0) {
      repositoriesheading.innerHTML =
        "<p>No repositories found for this user.</p>";
    } else {
      await adduser(username);
      await fetchAndDisplayLanguages(data);
      displayPagination(data);
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    repositoriesheading.innerHTML =
      "<p>Error fetching repositories. Please try again.</p>";
  } finally {
    subj.style.display = "none";
  }
}

async function fetchAndDisplayLanguages(repositories) {
  for (const repo of repositories) {
    const languagesResponse = await fetch(repo.languages_url);
    const languagesData = await languagesResponse.json();
    const languages = Object.keys(languagesData);
    // Adding languages array to the repository object
    repo.languages = languages;

    displayRepository(repo);
  }
}

function displayRepository(repo) {
  const repoDiv = document.createElement("div");
  repoDiv.classList.add("repository-box");

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("repo-title");
  titleDiv.innerHTML = `<h2>${repo.name}</h2>`;
  repoDiv.appendChild(titleDiv);

  const descDiv = document.createElement("div");
  descDiv.classList.add("repo-description");
  descDiv.innerHTML = `<p>${
    repo.description || "No description available"
  }</p>`;
  repoDiv.appendChild(descDiv);

  const techDiv = document.createElement("div");
  techDiv.classList.add("repo-tech");

  repo.languages.forEach((language) => {
    const techBox = document.createElement("div");
    techBox.classList.add("tech-box");
    techBox.textContent = language;
    techDiv.appendChild(techBox);
  });

  repoDiv.appendChild(techDiv);

  repositoriesheading.appendChild(repoDiv);
}

function displayPagination(repositories) {
  // Assuming 10 repositories per page
  const totalPages = Math.ceil(repositories.length / 10);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      const start = (i - 1) * 10;
      const end = start + 10;
      const pageRepositories = repositories.slice(start, end);
      repositoriesheading.innerHTML = "";
      pageRepositories.forEach((repo) => displayRepository(repo));
    });
    paginationheading.appendChild(button);
  }
}

async function adduser(username) {
  const account = await fetch(`https://api.github.com/users/${username}`);
  const data = await account.json();

  const userPhoto = document.createElement("span");
  const userPhotoHTML = `<img src="${data.avatar_url}" alt="${username}'s avatar" style="width: 300px; height: 300px; border-radius: 50%;">`;
  userPhoto.innerHTML = userPhotoHTML;
  const url = document.createElement("div");
  const urltag = `<a href="${data.html_url}">${data.url}</a>`;
  // userPhoto.innerHTML=url;
  url.innerHTML = urltag;

  const userfullname = document.createElement("h2");
  userfullname.innerHTML = data.name;
  const userbio = document.createElement("p");
  userbio.innerHTML = data.bio;
  const userloc = document.createElement("p");
  userloc.innerHTML = "🌍" + data.location;

  const twiterHTML = `<b>Twitter:-</b><a href="https://twitter.com/${data.twitter_username}" target="blank" >https://twitter.com/${data.twitter_username}</a>`;
  const twiter = document.createElement("div");
  twiter.innerHTML = twiterHTML;

  const detailsdiv = document.createElement("div");
  detailsdiv.appendChild(userfullname);
  detailsdiv.appendChild(url);
  detailsdiv.appendChild(userbio);
  detailsdiv.appendChild(userloc);
  detailsdiv.appendChild(twiter);

  console.log(data);
  user.appendChild(userPhoto);
  user.appendChild(detailsdiv);
}
