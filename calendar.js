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

    monthYear.textContent = `${monthNames[month]} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // День недели (0 - воскресенье, 6 - суббота)

    totalDays.textContent = daysInMonth;

    // Коррекция: делаем понедельник первым днем недели
    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Очистка календаря перед добавлением новых элементов
    calendarGrid.innerHTML = "";

    // Заполняем пустые ячейки перед началом месяца
    for (let i = 0; i < adjustedFirstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        calendarGrid.appendChild(emptyCell);
    }

    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;
        dayElement.classList.add("day");
        dayElement.dataset.day = day;

        // Добавляем обработчик клика для отметки дня
        dayElement.addEventListener("click", function () {
            this.classList.toggle("checked");
            updateCounter();
        });

        calendarGrid.appendChild(dayElement);
    }

    // Заполняем пустые дни в конце, чтобы всего было ровно 35
    let totalCells = adjustedFirstDayIndex + daysInMonth;
    let emptyCellsAtEnd = 35 - totalCells;
    
    for (let i = 0; i < emptyCellsAtEnd; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        calendarGrid.appendChild(emptyCell);
    }

    function updateCounter() {
        const checkedDays = document.querySelectorAll(".day.checked").length;
        checkedCount.textContent = checkedDays;
    }

    // Восстанавливаем заметки из LocalStorage
    notesArea.value = localStorage.getItem("habit-notes") || "";
    notesArea.addEventListener("input", function () {
        localStorage.setItem("habit-notes", notesArea.value);
    });
});
