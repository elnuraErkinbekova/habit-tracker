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
    habitInput.focus();
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
      habitInput.focus();
    }
  });

  // Handle color selection
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

  // Close modal with Escape key
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modal.style.display = "none";
    }
  });

  // Save when Enter key is pressed
  window.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && document.activeElement !== habitImage) {
      e.preventDefault();
      saveHabit.click();
    }
  });

  // Function to create a habit button with a delete button
  function createHabitButton(habitName, color, imageSrc = null) {
    const newButton = document.createElement("a");
    newButton.classList.add("habit-button");
    newButton.href = `calendar.html?habit=${habitName.toLowerCase()}`;
    newButton.style.background = color;
    newButton.style.position = "relative"; // Ensure relative positioning

    if (imageSrc) {
      newButton.innerHTML = `<img src="${imageSrc}" alt="${habitName}" />${habitName}`;
    } else {
      newButton.innerHTML = habitName;
    }

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button");
    deleteBtn.innerHTML = "×";
    deleteBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent link from opening
      newButton.remove(); // Remove the habit button
    });

    newButton.appendChild(deleteBtn);
    grid.appendChild(newButton);
  }

  // Save habit button
  saveHabit.addEventListener("click", function () {
    const habitName = habitInput.value.trim();
    if (habitName === "") return;

    if (!selectedColor) {
      alert("Please select a color!");
      return;
    }

    createHabitButton(habitName, selectedColor, uploadedImage);

    habitInput.value = "";
    habitImage.value = "";
    selectedColor = null;
    uploadedImage = null;
    colorOptionsContainer
      .querySelectorAll(".color-choice")
      .forEach((c) => c.classList.remove("selected"));

    modal.style.display = "none";
  });

  // Add delete buttons to existing habit buttons
  document.querySelectorAll(".habit-button").forEach((button) => {
    if (!button.querySelector(".delete-button")) {
      // Prevent duplicates
      button.style.position = "relative"; // Ensure existing buttons have relative positioning

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-button");
      deleteBtn.innerHTML = "×";
      deleteBtn.addEventListener("click", function (event) {
        event.preventDefault();
        button.remove();
      });

      button.appendChild(deleteBtn);
    }
  });
});
