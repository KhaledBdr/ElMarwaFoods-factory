// function showQuantity() {
//   const quan = document.getElementById("quantity");
//   quan.style.display = "block";
//   const cb = document.getElementById("checkLastOrder");
//   cb.style.display = "block";
// }

function showNotes() {
  const checkBox = document.querySelector("#checkLastOrder");
  const quan = document.getElementById("notes");
  const submitBTN = $("#submitBTN");
  const addanotherItem = $("#addanotherItem");
  console.log("HI");
  hidding(checkBox, quan, submitBTN, addanotherItem);
}
function hidding(checkBox, quan, submitBTN, addanotherItem) {
  if (checkBox.checked) {
    quan.style.display = "none";
    submitBTN.css("display", "none");
    addanotherItem.css("display", "block");
  } else {
    quan.style.display = "block";
    submitBTN.css("display", "block");
    addanotherItem.css("display", "none");
  }
}

// download Bill
