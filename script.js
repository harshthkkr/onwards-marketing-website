const form = document.querySelector("#notify-form");
const note = document.querySelector("#form-note");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(form).get("email");

  const subject = encodeURIComponent("Keep me posted about Onwards");
  const body = encodeURIComponent(`Please add ${email} to the Onwards launch list.`);
  note.textContent = "Your email app is opening — send the note and we'll keep you posted. 🎉";
  note.classList.add("success");
  window.location.href = `mailto:hello@onwards.app?subject=${subject}&body=${body}`;
});
