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
      input.addEventListener("click", setKeyColor)
      keyElement.appendChild(input)
      rowElement.appendChild(keyElement)
    })
    keyboard.appendChild(rowElement)
  })
}

function validateInput(event) {
  const input = event.target
  const value = input.value.trim()

  if (value && !validKeys.has(value)) {
    input.setAttribute("data-tooltip", `Invalid key: ${value}`)
    input.style.color = "red"
  } else {
    input.removeAttribute("data-tooltip")
    input.style.color = ""
  }
}

function escapeAHK(str) {
  return str.replace(/[`,;]/g, (match) => {
    switch (match) {
      case ",":
        return "`,"
      case ";":
        return "`;"
      case "`":
        return "``"
      default:
        return match
    }
  })
}

function generateBindings() {
  const keys = document.querySelectorAll(".key input")
  let output = ""
  keys.forEach((key) => {
    if (key.style.color === "red") {
      alert(key.getAttribute("data-tooltip"))
    }
    if (key.value && key.value !== key.dataset.defaultValue) {
      const from = escapeAHK(key.dataset.defaultValue)
      const to = key.value
      output += `${from}::${to}\n`
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
      let [, from, to] = match
      from = from.replace(/`(,|;|`)/g, "$1")
      to = to.replace(/`(,|;|`)/g, "$1")
      const input = Array.from(inputs).find((input) => input.dataset.defaultValue === from)
      if (input) {
        input.value = to
      }
    }
  })
}

function resetKeyboard() {
  document.querySelectorAll(".key input").forEach((input) => {
    input.value = ""
  })
  document.getElementById("output").value = ""
}

function downloadConfig() {
  const content = document.getElementById("output").value
  if (!content) {
    alert("No configuration to download. Please generate custom bindings first.")
    return
  }

  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "keyboard_config.ahk"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function toggleDarkMode(event) {
  if (event.target.checked) {
    document.body.classList.add("dark-mode")
  } else {
    document.body.classList.remove("dark-mode")
  }
}

function setKeyColor(event) {
  if (document.getElementById("setColors").checked) {
    event.parent.target.style.backgroundColor = document.getElementById("currentColor").value
  }
}

function setModeColors(event) {
  if (event.target.checked) {
      document.querySelectorAll('.key > input').forEach(input => {
      input.style.cursor = "crosshair"
      input.readOnly = true
    })
  }
}

function setModeBindings(event) {
  if (event.target.checked) {
    document.querySelectorAll('.key > input').forEach(input => {
      input.style.cursor = ""
      input.readOnly = false
    })
  }
}


document.addEventListener("DOMContentLoaded", () => {
  createKeyboard()
  document.getElementById("generateButton").addEventListener("click", generateBindings)
  document.getElementById("loadConfigButton").addEventListener("click", loadConfig)
  document.getElementById("resetButton").addEventListener("click", resetKeyboard)
  document.getElementById("downloadButton").addEventListener("click", downloadConfig)
  document.getElementById("toggleDarkMode").addEventListener("change", toggleDarkMode)
  document.getElementById("setBindings").addEventListener("click", setModeBindings)
  document.getElementById("setColors").addEventListener("click", setModeColors)
})




