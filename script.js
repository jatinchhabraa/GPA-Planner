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
  calculateLiveSGPA(Infinity); // Recalculate after new row
});

// Delete a course row
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-row");
  deleteButtons.forEach((btn) => {
    btn.onclick = () => {
      btn.parentElement.parentElement.remove();
      calculateLiveSGPA(Infinity); // Recalculate SGPA after deletion
    };
  });
}
addDeleteListeners(); // Initial call

// Live SGPA calculation
function calculateLiveSGPA(validateUntil = Infinity) {
  const creditInputs = document.querySelectorAll(".credit-input");
  const gradeSelects = document.querySelectorAll(".grade-select");

  let totalPoints = 0;
  let totalCredits = 0;
  let warnings = [];

  // Clear old borders
  creditInputs.forEach((input) => (input.style.border = ""));
  gradeSelects.forEach((select) => (select.style.border = ""));
  for (let i = 0; i < creditInputs.length; i++) {
    const credit = parseFloat(creditInputs[i].value);
    const gradePoint = parseFloat(gradeSelects[i].value);

    // Skip validation for current/future rows
    if (validateUntil !== Infinity && i >= validateUntil) {
      if (!isNaN(credit) && !isNaN(gradePoint)) {
        totalCredits += credit;
        totalPoints += credit * gradePoint;
      }
      continue;
    }

    // ✅ Validate only previous rows
    let isInvalid = false;

    if (isNaN(credit)) {
      creditInputs[i].style.border = "2px solid red";
      isInvalid = true;
    }
    if (isNaN(gradePoint)) {
      gradeSelects[i].style.border = "2px solid red";
      isInvalid = true;
    }

    if (isInvalid) {
      warnings.push(`Row ${i + 1}: Missing credit or grade`);
      continue;
    }

    totalCredits += credit;
    totalPoints += credit * gradePoint;
  }

  const sgpaBox = document.getElementById("sgpa-result");
  const warningBox = document.getElementById("sgpa-warning");

  if (totalCredits === 0) {
    sgpaBox.innerText = `Waiting for valid inputs...`;
    warningBox.innerHTML = warnings.join("<br>");
    return;
  }

  const sgpa = (totalPoints / totalCredits).toFixed(2);
  sgpaBox.innerText = `Your SGPA is: ${sgpa}`;
  warningBox.innerHTML = warnings.join("<br>");
}

// Add real-time listeners to all inputs
function addLiveListeners() {
  const creditInputs = document.querySelectorAll(".credit-input");
  const gradeSelects = document.querySelectorAll(".grade-select");

  creditInputs.forEach((input, index) => {
    input.addEventListener("input", () => calculateLiveSGPA(index));
    input.addEventListener("focus", () => calculateLiveSGPA(index));
  });

  gradeSelects.forEach((select, index) => {
    select.addEventListener("change", () => calculateLiveSGPA(index));
    select.addEventListener("focus", () => calculateLiveSGPA(index));
  });
}

addLiveListeners();
calculateLiveSGPA(Infinity); // Show initial result

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
