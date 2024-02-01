const storyForm = document.getElementById("storyForm");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const imageInput = document.getElementById("imageInput");
const storyList = document.getElementById("storyList");
const storyContent = document.getElementById("storyContent");

let stories = [];

function renderStoryList() {
  storyList.innerHTML = "";
  stories.forEach((story, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = story.title;

    const deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = "🗑️"; // Using the trash bin emoji as the icon
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.float = "right";
    deleteIcon.addEventListener("click", () => {
      stories.splice(index, 1); // Remove the story from the array
      localStorage.setItem("stories", JSON.stringify(stories));
      renderStoryList(); // Re-render the story list
    });

    listItem.appendChild(deleteIcon);
    listItem.addEventListener("click", (e) => {
      if (e.target !== deleteIcon) {
        // Ensure the story content is not shown when the delete icon is clicked
        renderStoryContent(story);
      }
    });

    storyList.appendChild(listItem);
  });
}

function renderStoryContent(story) {
  storyContent.innerHTML = `
    <h2>${story.title}</h2>
    ${story.image ? `<img src="${story.image}" alt="${story.title}">` : ""}
    <p>${story.content}</p>
  `;
  renderCommentsList(story.comments || []);
  showCommentSection();
}

function addStory(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const file = imageUpload.files[0];

  if (title && content) {
    const story = { title, content };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        story.image = reader.result;
        stories.push(story);
        localStorage.setItem("stories", JSON.stringify(stories));
        renderStoryList();
        titleInput.value = "";
        contentInput.value = "";
        imageUpload.value = "";
      };
      reader.readAsDataURL(file);
    } else if (imageInput.value.trim()) {
      story.image = imageInput.value.trim();
      stories.push(story);
      localStorage.setItem("stories", JSON.stringify(stories));
      renderStoryList();
      titleInput.value = "";
      contentInput.value = "";
      imageInput.value = "";
    } else {
      stories.push(story);
      localStorage.setItem("stories", JSON.stringify(stories));
      renderStoryList();
      titleInput.value = "";
      contentInput.value = "";
    }
  }
}

storyForm.addEventListener("submit", addStory);

document.addEventListener("DOMContentLoaded", () => {
  const storedData = localStorage.getItem("stories");
  if (storedData) {
    stories = JSON.parse(storedData);
    renderStoryList();
  }
  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.id = "commentInput";
  commentInput.placeholder = "Add a comment...";

  const commentButton = document.createElement("button");
  commentButton.textContent = "Add Comment";
  commentButton.addEventListener("click", addComment);

  const commentSection = document.getElementById("commentSection");
  commentSection.appendChild(commentInput);
  commentSection.appendChild(commentButton);
});
function renderCommentsList(comments) {
  const commentsList = document.getElementById("commentsList");
  commentsList.innerHTML = "";

  comments.forEach((comment) => {
    const listItem = document.createElement("li");
    listItem.classList.add("comment");
    listItem.textContent = comment;
    commentsList.appendChild(listItem);
  });
}
function addComment(event) {
  event.preventDefault();
  const commentInput = document.getElementById("commentInput");
  const comment = commentInput.value.trim();

  if (comment) {
    const currentStoryTitle = document
      .getElementById("storyContent")
      .querySelector("h2").textContent;
    const currentStoryIndex = stories.findIndex(
      (story) => story.title === currentStoryTitle
    );

    if (currentStoryIndex !== -1) {
      stories[currentStoryIndex].comments =
        stories[currentStoryIndex].comments || [];
      stories[currentStoryIndex].comments.push(comment);

      localStorage.setItem("stories", JSON.stringify(stories));
      renderCommentsList(stories[currentStoryIndex].comments);
      commentInput.value = "";
    }
  }
}
function showCommentSection() {
  const commentSection = document.getElementById("commentSection");
  commentSection.style.display = "block";
}

function hideCommentSection() {
  const commentSection = document.getElementById("commentSection");
  commentSection.style.display = "none";
}
// ... (existing code)

function updateStoryForm(story) {
  titleInput.value = story.title;
  contentInput.value = story.content;

  if (story.image) {
    imageInput.value = ""; // Clear image URL if present
    imageUpload.value = ""; // Clear file input if present
  } else {
    imageInput.value = story.image || "";
    imageUpload.value = ""; // Clear file input if present
  }
}

function updateStory(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const file = imageUpload.files[0];

  if (title && content) {
    const currentStoryTitle = document
      .getElementById("storyContent")
      .querySelector("h2").textContent;

    const currentStoryIndex = stories.findIndex(
      (story) => story.title === currentStoryTitle
    );

    if (currentStoryIndex !== -1) {
      stories[currentStoryIndex].title = title;
      stories[currentStoryIndex].content = content;

      if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
          stories[currentStoryIndex].image = reader.result;
          localStorage.setItem("stories", JSON.stringify(stories));
          renderStoryList();
          renderStoryContent(stories[currentStoryIndex]);
          titleInput.value = "";
          contentInput.value = "";
          imageUpload.value = "";
        };
        reader.readAsDataURL(file);
      } else if (imageInput.value.trim()) {
        stories[currentStoryIndex].image = imageInput.value.trim();
        localStorage.setItem("stories", JSON.stringify(stories));
        renderStoryList();
        renderStoryContent(stories[currentStoryIndex]);
        titleInput.value = "";
        contentInput.value = "";
        imageInput.value = "";
      } else {
        localStorage.setItem("stories", JSON.stringify(stories));
        renderStoryList();
        renderStoryContent(stories[currentStoryIndex]);
        titleInput.value = "";
        contentInput.value = "";
      }

      // Hide the update form after updating
      document.getElementById("updateForm").style.display = "none";
      document.getElementById("storyForm").style.display = "block";
    }
  }
}

function deleteStory() {
  const currentStoryTitle = document
    .getElementById("storyContent")
    .querySelector("h2").textContent;

  const currentStoryIndex = stories.findIndex(
    (story) => story.title === currentStoryTitle
  );

  if (currentStoryIndex !== -1) {
    stories.splice(currentStoryIndex, 1);
    localStorage.setItem("stories", JSON.stringify(stories));
    renderStoryList();
    storyContent.innerHTML = "";
  }
}

// Add event listeners
storyForm.addEventListener("submit", addStory);
document.getElementById("updateButton").addEventListener("click", () => {
  const currentStoryTitle = document
    .getElementById("storyContent")
    .querySelector("h2").textContent;

  const currentStory = stories.find(
    (story) => story.title === currentStoryTitle
  );

  if (currentStory) {
    updateStoryForm(currentStory);
    // Show the update form and hide the new story form
    document.getElementById("updateForm").style.display = "block";
    document.getElementById("storyForm").style.display = "none";
  }
});

document.getElementById("updateForm").addEventListener("submit", updateStory);
document.getElementById("deleteButton").addEventListener("click", deleteStory);

// ... (existing code)
