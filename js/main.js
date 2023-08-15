let groupsFilter = document.querySelector(".groups-filter");
let adressFilter = document.querySelector(".adress-filter");
let groupsSelect = document.querySelector(".groups-select");
let adressSelect = document.querySelector(".adress-select");
let studentForm = document.querySelector(".student-form");
let saveBtn = document.querySelector(".save-btn");
let studentModal = document.querySelector("#studentModal");
let studentsTableBody = document.querySelector(".students-table tbody");
let openModalBtn = document.querySelector(".open-modal-btn");
let studentSearch = document.querySelector(".student-search");

groupsFilter.innerHTML = `<option value="all">All</option>`;

position.map((gr) => {
  groupsFilter.innerHTML += `<option value="${gr}">${gr}</option>`;
  groupsSelect.innerHTML += `<option value="${gr}">${gr}</option>`;
});
Adress.map((gr) => {
  adressFilter.innerHTML += `<option value="${gr}">${gr}</option>`;
  adressSelect.innerHTML += `<option value="${gr}">${gr}</option>`;
})
let studentsJson = localStorage.getItem("students");

let students = JSON.parse(studentsJson) || [];

let selected = null;

let search = "";

let group = "all";

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let elements = this.elements;

  let student = {
    firstName: elements.firstName.value,
    lastName: elements.lastName.value,
    Position_level: elements.Position_level.value,
    IsMarried: elements.IsMarried.checked,
    Salary: elements.Salary.value,
    Adress: elements.Adress.value,
  };

  if (this.checkValidity()) {
    bootstrap.Modal.getInstance(studentModal).hide();
    if (selected == null) {
      students.push(student);
    } else {
      students[selected] = student;
    }
    localStorage.setItem("students", JSON.stringify(students));
    getStudents();
  } else {
    this.classList.add("was-validated");
  }

  console.log(students);
});

function getStudentRow({ firstName, lastName, Position_level, IsMarried, Salary, Adress }, i) {
  return `
    <tr>
      <th scope="row">${i + 1}</th>
      <td scope="col">${firstName}</td>
      <td scope="col">${lastName}</td>
      <td scope="col">${Position_level}</td>
      <td scope="col">${IsMarried ? "Ha" : "Yo'q"}</td>
      <td scope="col">${Adress}</td>
      <td scope="col">${Salary}</td>
      <td scope="col" class="text-end">
        <button onClick="editStudent(${i})" class="btn btn-primary mr-3" data-bs-toggle="modal" data-bs-target="#studentModal">Edit</button>
        <button class="btn btn-danger" onClick="deleteStudent(${i})">Delete</button>
      </td>
    </tr>
  `;
}

function getStudents() {
  let results = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  if (group !== "all") {
    results = results.filter((student) => student.group === group);
  }

  studentsTableBody.innerHTML = "";

  if (results.length === 0) {
    studentsTableBody.innerHTML = "No students";
  } else {
    results.map((student, i) => {
      studentsTableBody.innerHTML += getStudentRow(student, i);
    });
  }
}

getStudents();

function editStudent(i) {
  selected = i;
  saveBtn.textContent = "Save student";

  let { firstName, lastName, Position_level, Adress, IsMarried } = students[i];
  let elements = studentForm.elements;
  elements.firstName.value = firstName;
  elements.lastName.value = lastName;
  elements.Position_level.value = Position_level;
  elements.Adress.value = Adress;
  elements.IsMarried.checked = IsMarried;
}

openModalBtn.addEventListener("click", () => {
  selected = null;
  saveBtn.textContent = "Add student";

  let elements = studentForm.elements;
  elements.firstName.value = "";
  elements.lastName.value = "";
  elements.Position_level.value = "Junior";
  elements.Adress.value = "Farg'ona";
  elements.IsMarried.checked = false;
});

function deleteStudent(i) {
  let isDelete = confirm("Do you want to delete this student ?");
  if (isDelete) {
    students.splice(i, 1);
    localStorage.setItem("students", JSON.stringify(students));
    getStudents();
  }
}

studentSearch.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});

groupsFilter.addEventListener("change", function () {
  group = this.value;
  getStudents();
});
