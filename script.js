// Add a new course row
document.getElementById("add-row").addEventListener("click", () => {
  const tableBody = document.getElementById("course-body");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
      <td><input type="text" placeholder="Course Name"></td>
      <td><input type="number" class="credit-input" min="0" step="0.5"></td>
      <td>
        <select class="grade-select">
          <option value="">--Select--</option>
          <option value="10">A</option>
          <option value="9">A-</option>
          <option value="8">B</option>
          <option value="7">B-</option>
          <option value="5">C</option>
          <option value="2">E</option>
        </select>
      </td>
      <td><button class="delete-row">Delete</button></td>
    `;

  tableBody.appendChild(newRow);
  addDeleteListeners(); // Ensure new delete buttons work
  addLiveListeners(); // Add live calculation listeners
  calculateLiveSGPA(); // Recalculate after new row
});

// Delete a course row
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-row");
  deleteButtons.forEach((btn) => {
    btn.onclick = () => {
      btn.parentElement.parentElement.remove();
      calculateLiveSGPA(); // Recalculate SGPA after deletion
    };
  });
}
addDeleteListeners(); // Initial call

// Live SGPA calculation
function calculateLiveSGPA() {
  const creditInputs = document.querySelectorAll(".credit-input");
  const gradeSelects = document.querySelectorAll(".grade-select");

  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < creditInputs.length; i++) {
    const credit = parseFloat(creditInputs[i].value);
    const gradePoint = parseFloat(gradeSelects[i].value);

    if (!isNaN(credit) && !isNaN(gradePoint)) {
      totalCredits += credit;
      totalPoints += credit * gradePoint;
    }
  }

  const resultBox = document.getElementById("sgpa-result");

  if (totalCredits === 0) {
    resultBox.innerText = `Waiting for valid inputs...`;
    return;
  }

  const sgpa = (totalPoints / totalCredits).toFixed(2);
  resultBox.innerText = `Your SGPA is: ${sgpa}`;
}

// Add real-time listeners to all inputs
function addLiveListeners() {
  const creditInputs = document.querySelectorAll(".credit-input");
  const gradeSelects = document.querySelectorAll(".grade-select");

  creditInputs.forEach((input) =>
    input.addEventListener("input", calculateLiveSGPA)
  );

  gradeSelects.forEach((select) =>
    select.addEventListener("change", calculateLiveSGPA)
  );
}
addLiveListeners();
calculateLiveSGPA(); // Show initial result

// Calculate CGPA (on button click only)
document.getElementById("calculate-cgpa").addEventListener("click", () => {
  const prevCredits = parseFloat(document.getElementById("prev-credits").value);
  const prevPoints = parseFloat(document.getElementById("prev-points").value);

  const creditInputs = document.querySelectorAll(".credit-input");
  const gradeSelects = document.querySelectorAll(".grade-select");

  let currentPoints = 0;
  let currentCredits = 0;

  for (let i = 0; i < creditInputs.length; i++) {
    const credit = parseFloat(creditInputs[i].value);
    const gradePoint = parseFloat(gradeSelects[i].value);

    if (!isNaN(credit) && !isNaN(gradePoint)) {
      currentCredits += credit;
      currentPoints += credit * gradePoint;
    }
  }

  if (isNaN(prevCredits) || isNaN(prevPoints)) {
    alert("Please enter valid previous credits and points.");
    return;
  }

  const totalCredits = prevCredits + currentCredits;
  const totalPoints = prevPoints + currentPoints;

  if (totalCredits === 0) {
    document.getElementById(
      "cgpa-result"
    ).innerText = `Total credits cannot be zero.`;
    return;
  }

  const cgpa = (totalPoints / totalCredits).toFixed(2);
  document.getElementById("cgpa-result").innerText = `Your CGPA is: ${cgpa}`;
});
