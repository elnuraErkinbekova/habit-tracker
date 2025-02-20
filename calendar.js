document.addEventListener("DOMContentLoaded", function () {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYear = document.getElementById("month-year");
    const checkedCount = document.getElementById("checked-count");
    const totalDays = document.getElementById("total-days");
    const notesArea = document.getElementById("notes-area");

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const goalInput = document.getElementById("goal-input");
    const goalProgress = document.querySelector(".goal-progress");
    const goalPercentage = document.getElementById("goal-percentage");

    // Получаем привычку из URL-параметра
    const urlParams = new URLSearchParams(window.location.search);
    const selectedHabit = urlParams.get("habit") || "habit_default";

    // Загружаем сохранённую цель
    function loadGoal() {
        const savedGoal = localStorage.getItem(`habitGoal_${selectedHabit}`);
        if (savedGoal) {
            goalInput.value = savedGoal;
        }
        updateGoalIndicator();
    }

    // Обновляем индикатор в зависимости от текущего прогресса
    function updateGoalIndicator() {
        const goal = parseInt(goalInput.value, 10) || 1;
        const completed = getHabitProgress();
        const percentage = Math.min((completed / goal) * 100, 100);

        goalProgress.style.width = percentage + "%";
        goalPercentage.textContent = Math.round(percentage) + "%";

        localStorage.setItem(`habitGoal_${selectedHabit}`, goal);
    }

    // Получаем текущее количество отмеченных дней
    function getHabitProgress() {
        const progressData = JSON.parse(localStorage.getItem(`habitProgress_${selectedHabit}`)) || [];
        return progressData.length;
    }

    // Сохраняем прогресс в `localStorage` и обновляем индикатор
    function markDayAsCompleted(day, isAdding) {
        let progressData = JSON.parse(localStorage.getItem(`habitProgress_${selectedHabit}`)) || [];
    
        if (isAdding) {
            if (!progressData.includes(day)) {
                progressData.push(day);
            }
        } else {
            progressData = progressData.filter(d => d !== day);
        }
    
        localStorage.setItem(`habitProgress_${selectedHabit}`, JSON.stringify(progressData));
        updateGoalIndicator();
    }
    

    // Обновляем индикатор при изменении цели
    goalInput.addEventListener("input", updateGoalIndicator);

    monthYear.textContent = `${monthNames[month]} ${year}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    totalDays.textContent = daysInMonth;

    function getHabitData() {
        return JSON.parse(localStorage.getItem(`habitTracker_${selectedHabit}`)) || [];
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

            if (checkedDays.includes(day)) {
                dayElement.textContent = "✔️";
                dayElement.classList.add("checked");
            }

            dayElement.addEventListener("click", function () {
                let data = getHabitData();
                if (data.includes(day)) {
                    data = data.filter(d => d !== day);
                    this.textContent = this.dataset.day;
                    this.classList.remove("checked");
                    markDayAsCompleted(day, false); // Убираем день из прогресса
                } else {
                    data.push(day);
                    this.textContent = "✔️";
                    this.classList.add("checked");
                    markDayAsCompleted(day, true); // Добавляем день в прогресс
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

    notesArea.addEventListener("input", function () {
        localStorage.setItem(`habitNotes_${selectedHabit}`, notesArea.value);
    });

    loadGoal();
    loadCalendar();
    loadNotes();
});
