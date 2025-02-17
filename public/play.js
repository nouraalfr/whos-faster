const contentDiv = document.getElementById('content')
const content = contentDiv.textContent
const words = content.split(' ')
let correctWords = 0
contentDiv.innerHTML = ''

content.split('').forEach((char) => {
  const charSpan = document.createElement('span')
  charSpan.innerText = char
  charSpan.classList.add('text-gray-600', 'dark:text-gray-400')
  contentDiv.appendChild(charSpan)
})

function addColor(colors, char) {
  char.classList.add(...colors)
}
function removeColor(colors, char) {
  char.classList.remove(...colors)
}

function isArabicChar(char) {
  if (typeof char !== 'string' || char.length !== 1) {
    return false
  }
  const arabicRange = /[\u0621-\u064A\u066E-\u066F\u0671-\u06D3\u06D5-\u06FF\s،\.\:]/
  return arabicRange.test(char)
}

async function score(score, textID) {
  const response = await fetch(`${window.location.origin}/attempt`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      textID: textID,
      score: score,
    }),
    method: 'POST',
  })
}

function finishTyping() {
  document.removeEventListener('keydown', play)
  const resultsContainer = document.getElementById('results-container')
  const resultCorrect = document.getElementById('result-correct')
  const resultWPM = document.getElementById('result-wpm')
  const signupDiv = document.getElementById('signup')
  const timeElapsed = (Date.now() - startTime) / 60000
  const wpm = Math.round(correctWords / timeElapsed)
  resultCorrect.innerHTML = ` الكلمات الصحيحة:  ${correctWords}`
  resultWPM.innerHTML = ` كلمة في الدقيقة:  ${wpm}`
  resultsContainer.classList.remove('hidden')

  const textId = window.textId
  const user = window.user

  if (user) {
    score(wpm, textId)
  } else {
    signupDiv.innerHTML = `
    <p class="text-black dark:text-white lg:text-lg md:text-lg text-md font-bold mt-4">
      <a href="/register" class="underline dark:text-purple-400 text-purple-600 hover:text-purple-500 dark:hover:text-purple-300">انشئ حسابك</a>
      وسجل سرعة كتابتك مع أسرع ناس بالعالم!
    </p>
  `
    signupDiv.classList.remove('hidden')
  }
}

function checkWord() {
  if (typed.trim() === words[word]) {
    correctWords++
  }
  word++
  typed = ''
}

let index = 0
let startTime = 0
let word = 0
let typed = ''

function play(e) {

  if (!startTime) {
    startTime = Date.now()
  }

  const char = contentDiv.children[index].innerText
  switch (true) {
    case e.key == char && isArabicChar(char):
      removeColor(['text-red-500', 'dark:text-red-400', 'text-gray-600', 'dark:text-gray-400'],
        contentDiv.children[index])
      addColor(['text-emerald-600', 'dark:text-emerald-400'], contentDiv.children[index])
      index++
      typed += e.key
      break;
    case char == ' ' && e.key != ' ' && e.key != 'Backspace':
      removeColor(
        ['text-emerald-600', 'dark:text-emerald-400', 'text-gray-600', 'dark:text-gray-400'],
        contentDiv.children[index]
      )
      addColor(['text-red-500', 'dark:text-red-400'], contentDiv.children[index]);
      contentDiv.children[index].textContent = e.key
      index++;
      typed += ' ';
      break;
    case e.key != char && isArabicChar(e.key):
      removeColor(['text-emerald-600', 'dark:text-emerald-400', 'text-gray-600', 'dark:text-gray-400'],
        contentDiv.children[index])
      addColor(['text-red-500', 'dark:text-red-400'], contentDiv.children[index])
      index++
      typed += e.key
      break
    case (e.key === 'Backspace' || e.key === 'Delete') && index > 0:
      index--
      typed = typed.slice(0, -1)
      contentDiv.children[index].textContent = content.charAt(index)
      removeColor(['text-emerald-600', 'dark:text-emerald-400', 'text-red-500', 'dark:text-red-400'],
        contentDiv.children[index])
      addColor(['text-gray-600', 'dark:text-gray-400'], contentDiv.children[index])
      break;
  }

  if ((e.key === ' ' && char === ' ') || index === content.length) {
    checkWord()
  }
  if (index === content.length) {
    finishTyping()
  }
}

document.addEventListener('keydown', play) 