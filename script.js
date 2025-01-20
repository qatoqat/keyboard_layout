const keyboardLayout = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["Caps Lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Win", "Menu", "Ctrl"],
]

const specialKeys = {
  Backspace: "extra-wide",
  Tab: "wide",
  "Caps Lock": "extra-wide",
  Enter: "extra-wide",
  Shift: "extra-wide",
  Ctrl: "wide",
  Win: "wide",
  Alt: "wide",
  Space: "super-wide",
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard")
  keyboardLayout.forEach((row) => {
    const rowElement = document.createElement("div")
    rowElement.className = "row"
    row.forEach((key) => {
      const keyElement = document.createElement("div")
      keyElement.className = `key ${specialKeys[key] || ""}`
      const input = document.createElement("input")
      input.type = "text"
      input.placeholder = key
      input.maxLength = 20
      input.dataset.defaultValue = key
      keyElement.appendChild(input)
      rowElement.appendChild(keyElement)
    })
    keyboard.appendChild(rowElement)
  })
}

function generateBindings() {
  const keys = document.querySelectorAll(".key input")
  let output = ""
  keys.forEach((key) => {
    if (key.value && key.value !== key.dataset.defaultValue) {
      output += `${key.dataset.defaultValue}::${key.value}\n`
    }
  })
  document.getElementById("output").value = output || "No custom bindings."
}

document.addEventListener("DOMContentLoaded", () => {
  createKeyboard()
  document.getElementById("generateButton").addEventListener("click", generateBindings)
})

