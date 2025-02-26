document.addEventListener("DOMContentLoaded", function () {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthYear = document.getElementById("month-year");
  const checkedCount = document.getElementById("checked-count");
  const totalDays = document.getElementById("total-days");
  const notesArea = document.getElementById("notes-area");
  const goalInput = document.getElementById("goal-input");
  const goalProgress = document.querySelector(".goal-progress");
  const goalPercentage = document.getElementById("goal-percentage");
  const adviceList = document.getElementById("advice-list");

  const urlParams = new URLSearchParams(window.location.search);
  const selectedHabit = urlParams.get("habit") || "habit_default";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  function loadGoal() {
    const savedGoal = localStorage.getItem(`habitGoal_${selectedHabit}`);
    goalInput.value = savedGoal || 10;
    updateGoalIndicator();
  }

  function updateGoalIndicator() {
    const goal = parseInt(goalInput.value, 10) || 1;
    const completed = getHabitProgress();
    const percentage = Math.min((completed / goal) * 100, 100);

    goalProgress.style.width = percentage + "%";
    goalPercentage.textContent = Math.round(percentage) + "%";

    localStorage.setItem(`habitGoal_${selectedHabit}`, goal);
  }

  function getHabitProgress() {
    const progressData =
      JSON.parse(localStorage.getItem(`habitProgress_${selectedHabit}`)) || [];
    return progressData.length;
  }

  function markDayAsCompleted(day, isAdding) {
    let progressData =
      JSON.parse(localStorage.getItem(`habitProgress_${selectedHabit}`)) || [];

    if (isAdding) {
      if (!progressData.includes(day)) {
        progressData.push(day);
      }
    } else {
      progressData = progressData.filter((d) => d !== day);
    }

    localStorage.setItem(
      `habitProgress_${selectedHabit}`,
      JSON.stringify(progressData)
    );
    updateGoalIndicator();
  }

  goalInput.addEventListener("input", updateGoalIndicator);

  monthYear.textContent = `${monthNames[month]} ${year}`;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  totalDays.textContent = daysInMonth;

  function getHabitData() {
    return (
      JSON.parse(localStorage.getItem(`habitTracker_${selectedHabit}`)) || []
    );
  }

  function saveHabitData(data) {
    localStorage.setItem(`habitTracker_${selectedHabit}`, JSON.stringify(data));
  }

  function loadCalendar() {
    calendarGrid.innerHTML = "";
    let checkedDays = getHabitData();

    for (let i = 0; i < adjustedFirstDayIndex; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("day", "empty");
      calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;
      dayElement.classList.add("day");
      dayElement.dataset.day = day;

      const colors = [
        "var(--color1)",
        "var(--color2)",
        "var(--color3)",
        "var(--color4)",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      dayElement.style.backgroundColor = randomColor;

      if (checkedDays.includes(day)) {
        dayElement.textContent = "✔️";
        dayElement.classList.add("checked");
      }

      dayElement.addEventListener("click", function () {
        let data = getHabitData();
        const dayNumber = this.dataset.day;

        if (data.includes(parseInt(dayNumber))) {
          data = data.filter((d) => d !== parseInt(dayNumber));
          this.classList.remove("checked");
          this.textContent = dayNumber;
          markDayAsCompleted(parseInt(dayNumber), false);
        } else {
          data.push(parseInt(dayNumber));
          this.classList.add("checked");
          this.textContent = "✔️";
          markDayAsCompleted(parseInt(dayNumber), true);
        }

        saveHabitData(data);
        updateCounter();
      });

      calendarGrid.appendChild(dayElement);
    }

    let totalCells = adjustedFirstDayIndex + daysInMonth;
    let emptyCellsAtEnd = 35 - totalCells;
    for (let i = 0; i < emptyCellsAtEnd; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("day", "empty");
      calendarGrid.appendChild(emptyCell);
    }

    updateCounter();
  }

  function updateCounter() {
    checkedCount.textContent = getHabitData().length;
  }

  function loadNotes() {
    notesArea.value = localStorage.getItem(`habitNotes_${selectedHabit}`) || "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const days = document.querySelectorAll(".day");
    const colors = [
      "var(--color1)",
      "var(--color2)",
      "var(--color3)",
      "var(--color4)",
    ];

    days.forEach((day) => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      day.style.backgroundColor = randomColor;
    });
  });

  notesArea.addEventListener("input", function () {
    localStorage.setItem(`habitNotes_${selectedHabit}`, notesArea.value);
  });

  const advices = {
    fitness: [
      "Start with small workouts to build consistency.",
      "Drink plenty of water before and after exercise.",
      "Stretch before and after workouts to prevent injury.",
      "Set realistic fitness goals and track your progress.",
      "Find a workout buddy to stay motivated.",
    ],
    music: [
      "Practice regularly to improve your skills.",
      "Listen to music to inspire your playing.",
      "Experiment with different genres to expand your knowledge.",
      "Use a metronome to improve timing.",
      "Record yourself to track your progress.",
    ],
    hydration: [
      "Drink at least 8 glasses of water a day.",
      "Carry a water bottle with you wherever you go.",
      "Start your day with a glass of water.",
      "Infuse water with fruits to make it more enjoyable.",
      "Set reminders to drink water throughout the day.",
    ],
    walking: [
      "Start with short walks and gradually increase the distance.",
      "Try to walk at least 30 minutes a day.",
      "Explore new routes to make walks more interesting.",
      "Walk with a friend or family member for company.",
      "Track your steps with a fitness app.",
    ],
    relaxation: [
      "Practice deep breathing exercises to calm your mind.",
      "Listen to soothing music or nature sounds.",
      "Create a relaxing environment by dimming the lights.",
      "Take short breaks during the day to relax.",
      "Try yoga or meditation to relieve stress.",
    ],
    meditation: [
      "Start with just 5 minutes of meditation daily.",
      "Focus on your breathing to calm your mind.",
      "Use guided meditation apps for help.",
      "Find a quiet space for better concentration.",
      "Practice mindfulness throughout the day.",
    ],
    study: [
      "Break study sessions into manageable chunks.",
      "Find a quiet, distraction-free place to study.",
      "Use flashcards to reinforce key concepts.",
      "Take regular breaks to avoid burnout.",
      "Stay organized with a study schedule.",
    ],
    coding: [
      "Practice coding every day to improve your skills.",
      "Break problems into smaller parts to make them more manageable.",
      "Learn from online tutorials and coding communities.",
      "Keep track of your progress with small projects.",
      "Challenge yourself with coding challenges.",
    ],
    reading: [
      "Set a daily reading goal, even if it's just 10 minutes.",
      "Choose books that genuinely interest you.",
      "Create a comfortable reading space.",
      "Minimize distractions while reading.",
      "Take notes to remember key points.",
    ],
    yoga: [
      "Start with basic poses and gradually try more advanced ones.",
      "Focus on your breath during each pose.",
      "Practice yoga in the morning to set a positive tone for the day.",
      "Join a yoga class or find a partner to stay motivated.",
      "Incorporate meditation into your practice for mindfulness.",
    ],
  };

  const habitTitle = document.createElement("h2");
  habitTitle.innerText =
    selectedHabit.charAt(0).toUpperCase() + selectedHabit.slice(1);
  document.querySelector("#advice-box").prepend(habitTitle);

  console.log("Loading advice for habit: " + selectedHabit);
  const habitAdvice = advices[selectedHabit];
  if (habitAdvice && habitAdvice.length > 0) {
    console.log("Found advice: ", habitAdvice);
    habitAdvice.forEach((advice) => {
      const li = document.createElement("li");
      li.textContent = advice;
      adviceList.appendChild(li);
    });
  } else {
    console.log("No advice found for this habit.");
    const li = document.createElement("li");
    li.textContent = "No advice available for this habit.";
    adviceList.appendChild(li);
  }

  loadGoal();
  loadCalendar();
  loadNotes();
});
