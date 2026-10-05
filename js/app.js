const savedAssignments = localStorage.getItem("assignments");
let assignments = savedAssignments ? JSON.parse(savedAssignments) : [];

const courseInput = document.querySelector("#course");
const form = document.querySelector("#assignment-form");
const nameInput = document.querySelector("#assignment-name");
const dueDateInput = document.querySelector("#due-date");
const assignmentList = document.querySelector(".assignment-list");
const priorityInput = document.querySelector("#priority");

function saveAssignments() {
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

function displayAssignment(assignment) {
  const newAssignment = document.createElement("article");
  newAssignment.classList.add("assignment");
  newAssignment.classList.add(assignment.priority);

  const title = document.createElement("h3");
  title.textContent = assignment.name;
  newAssignment.append(title);

  const courseText = document.createElement("p");
  courseText.textContent = `Class: ${assignment.course}`;
  newAssignment.append(courseText);

  const priorityText = document.createElement("p");
  priorityText.textContent = `Priority: ${assignment.priority}`;
  newAssignment.append(priorityText);

  const date = document.createElement("p");
  date.textContent = `Due: ${new Date(`${assignment.dueDate}T00:00:00`).toLocaleDateString()}`;
  newAssignment.append(date);
if (assignment.classroomLink) {
  const classroomLink = document.createElement("a");

  classroomLink.href = assignment.classroomLink;
  classroomLink.textContent = "Open in Google Classroom";
  classroomLink.target = "_blank";

  newAssignment.append(classroomLink);
}

  const completeLabel = document.createElement("label");
  const completeBox = document.createElement("input");
  completeBox.type = "checkbox";
  completeBox.checked = assignment.completed;
  completeLabel.append(completeBox, " Completed");
  newAssignment.append(completeLabel);

  newAssignment.classList.toggle("completed", assignment.completed);

  completeBox.addEventListener("change", function () {
    assignment.completed = completeBox.checked;
    newAssignment.classList.toggle("completed", assignment.completed);
    saveAssignments();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  newAssignment.append(deleteButton);

  deleteButton.addEventListener("click", function () {
    assignments = assignments.filter(function (item) {
      return item !== assignment;
    });

    saveAssignments();
    newAssignment.remove();
  });

  assignmentList.append(newAssignment);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const assignment = {
    name: nameInput.value,
    course: courseInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    completed: false
  };

  assignments.push(assignment);
  saveAssignments();
  displayAssignment(assignment);
  form.reset();
});

assignments.forEach(function (assignment) {
  displayAssignment(assignment);
});
const loadCoursesButton = document.querySelector("#load-courses");
const classroomMessage = document.querySelector("#classroom-message");
const classroomCourses = document.querySelector("#classroom-courses");

loadCoursesButton.addEventListener("click", async function () {
  classroomMessage.textContent = "Loading Classroom courses...";
  classroomCourses.innerHTML = "";

  try {
    const response = await fetch("/api/courses");

    if (!response.ok) {
      throw new Error("Could not load courses.");
    }

    const courses = await response.json();

    if (courses.length === 0) {
      classroomMessage.textContent = "No active Classroom courses found.";
      return;
    }

    classroomMessage.textContent = "Your Classroom courses:";

    courses.forEach(function (course) {
      const courseButton = document.createElement("button");

      courseButton.type = "button";
      courseButton.textContent = course.name;

courseButton.addEventListener("click", function () {
  loadClassroomAssignments(course);
});

classroomCourses.append(courseButton);
    });
  } catch (error) {
    classroomMessage.textContent =
      "Could not load courses. Connect your Google account, then try again.";
  }
});
async function loadClassroomAssignments(course) {
  classroomMessage.textContent = `Loading assignments from ${course.name}...`;
  classroomCourses.innerHTML = "";

  try {
    const response = await fetch(
      `/api/courses/${course.id}/assignments`
    );

    if (!response.ok) {
      throw new Error("Could not load assignments.");
    }

    const classroomAssignments = await response.json();

    if (classroomAssignments.length === 0) {
      classroomMessage.textContent =
        `No published assignments found in ${course.name}.`;
      return;
    }

    classroomMessage.textContent =
      `Assignments from ${course.name}:`;

    classroomAssignments.forEach(function (classroomAssignment) {
      const assignmentCard = document.createElement("article");
      const title = document.createElement("h3");
      const date = document.createElement("p");

      assignmentCard.classList.add("assignment");
      title.textContent = classroomAssignment.title;

      if (classroomAssignment.dueDate) {
        const due = classroomAssignment.dueDate;
        date.textContent =
          `Due: ${due.month}/${due.day}/${due.year}`;
      } else {
        date.textContent = "No due date";
      }

      const importButton = document.createElement("button");
const alreadyImported = assignments.some(function (assignment) {
  return assignment.googleId === classroomAssignment.id;
});

if (alreadyImported) {
  importButton.textContent = "Already Imported";
  importButton.disabled = true;
} else {
  importButton.textContent = "Import to Planner";

  importButton.addEventListener("click", function () {
    let dueDate = "";

    if (classroomAssignment.dueDate) {
      const due = classroomAssignment.dueDate;
      dueDate =
        `${due.year}-${String(due.month).padStart(2, "0")}-${String(due.day).padStart(2, "0")}`;
    }

    const importedAssignment = {
      name: classroomAssignment.title,
      course: course.name,
      priority: "medium",
      dueDate: dueDate,
      completed: false,
      googleId: classroomAssignment.id,
      classroomLink: classroomAssignment.alternateLink
    };

    assignments.push(importedAssignment);
    saveAssignments();
    displayAssignment(importedAssignment);

    importButton.textContent = "Imported";
    importButton.disabled = true;
  });
}

assignmentCard.append(title, date, importButton);
classroomCourses.append(assignmentCard);
    });
  } catch (error) {
    classroomMessage.textContent =
      "Could not load assignments. Try connecting Google Classroom again.";
  }
}