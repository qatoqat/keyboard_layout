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

const validKeys = new Set([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "Escape",
  "Space",
  "Tab",
  "Capslock",
  "Shift",
  "Ctrl",
  "Alt",
  "Win",
  "Enter",
  "Backspace",
  "Insert",
  "Delete",
  "Home",
  "End",
  "PgUp",
  "PgDn",
  "Up",
  "Down",
  "Left",
  "Right",
  "`",
  "-",
  "=",
  "[",
  "]",
  "\\",
  ";",
  "'",
  ",",
  ".",
  "/",
])

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
      input.addEventListener("input", validateInput)
      keyElement.appendChild(input)
      rowElement.appendChild(keyElement)
    })
    keyboard.appendChild(rowElement)
  })
}

function validateInput(event) {
  const input = event.target
  const value = input.value.trim()
  const errorMessage = document.getElementById("error-message")

  if (value && !validKeys.has(value.toLowerCase())) {
    errorMessage.textContent = `Invalid key: ${value}`
    input.value = ""
  } else {
    errorMessage.textContent = ""
  }
}

function generateBindings() {
  const keys = document.querySelectorAll(".key input")
  let output = ""
  keys.forEach((key) => {
    if (key.value && key.value !== key.dataset.defaultValue) {
      let defaultValue = key.dataset.defaultValue
      if (defaultValue === ";") {
        defaultValue = "`;"
      }
      output += `${defaultValue}::${key.value}\n`
    }
  })
  document.getElementById("output").value = output || "No custom bindings."
}

async function loadConfig() {
  const url = prompt("Enter the URL of the .ahk config file:")
  if (!url) return

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Network response was not ok")
    const config = await response.text()
    applyConfig(config)
  } catch (error) {
    console.error("Error loading config:", error)
    alert("Failed to load config. Please check the URL and try again.")
  }
}

function applyConfig(config) {
  const lines = config.split("\n")
  const inputs = document.querySelectorAll(".key input")

  inputs.forEach((input) => (input.value = ""))

  lines.forEach((line) => {
    const match = line.match(/^(.+?)::(.+)$/)
    if (match) {
      const [, from, to] = match
      const input = Array.from(inputs).find((input) => input.dataset.defaultValue === from)
      if (input) {
        input.value = to
      }
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  createKeyboard()
  document.getElementById("generateButton").addEventListener("click", generateBindings)
  document.getElementById("loadConfigButton").addEventListener("click", loadConfig)
})

