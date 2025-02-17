document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector(".add-button");
  const modal = document.getElementById("habitModal");
  const closeModal = document.querySelector(".close");
  const saveHabit = document.getElementById("saveHabit");
  const habitInput = document.getElementById("habitInput");
  const habitImage = document.getElementById("habitImage");
  const grid = document.querySelector(".grid");

  const pastelColors = [
    "#f8c8dc",
    "#f5d0c8",
    "#f0e6ef",
    "#e6f0c2",
    "#d8e2dc",
    "#c8e6bf",
    "#b5e4fa",
    "#a7c7e7",
    "#d0bfff",
    "#e9c4ef",
  ];

  let selectedColor = null;
  let uploadedImage = null;

  // Open modal
  addButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close modal
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle image upload
  habitImage.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle color selection (EVENT DELEGATION)
  const colorOptionsContainer = document.querySelector(".color-options");

  pastelColors.forEach((color) => {
    const colorChoice = document.createElement("span");
    colorChoice.classList.add("color-choice");
    colorChoice.style.background = color;
    colorChoice.dataset.color = color;
    colorOptionsContainer.appendChild(colorChoice);
  });

  colorOptionsContainer.addEventListener("click", function (event) {
    const choice = event.target;

    if (choice.classList.contains("color-choice")) {
      colorOptionsContainer
        .querySelectorAll(".color-choice")
        .forEach((c) => c.classList.remove("selected"));
      choice.classList.add("selected");
      selectedColor = choice.dataset.color;
      uploadedImage = null;
    }
  });

  // Save habit
  saveHabit.addEventListener("click", function () {
    const habitName = habitInput.value.trim();
    if (habitName === "") return;

    const newButton = document.createElement("a");
    newButton.classList.add("habit-button");
    newButton.href = `calendar.html?habit=${habitName.toLowerCase()}`;

    if (uploadedImage) {
      newButton.innerHTML = `<img src="${uploadedImage}" alt="${habitName}" />${habitName}`;
    } else if (selectedColor) {
      newButton.style.background = selectedColor;
      newButton.innerHTML = habitName;
    } else {
      newButton.innerHTML = `<img src="images/default.svg" alt="${habitName}" />${habitName}`;
    }

    grid.appendChild(newButton);

    habitInput.value = "";
    habitImage.value = "";
    selectedColor = null;
    uploadedImage = null;
    colorOptionsContainer
      .querySelectorAll(".color-choice")
      .forEach((c) => c.classList.remove("selected")); // Clear selected color

    modal.style.display = "none";
  });
});
