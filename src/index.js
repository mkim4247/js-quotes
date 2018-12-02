// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', function(){
  getQuotes()
  getForm().addEventListener('submit', makeQuote)
})

function getQuotes(){
  fetch('http://localhost:3000/quotes')
    .then(resp => resp.json())
    .then(json => {
      json.forEach(renderQuote)
    })
}

function renderQuote(quote){
  let card = document.createElement('li')
  card.classList.add('card')
  card.id = `card-${quote.id}`

  let container = document.createElement('blockquote')
  card.appendChild(container)

  let content = document.createElement('p')
  content.innerText = quote.quote

  let author = document.createElement('p')
  author.innerText = quote.author

  let supporters = document.createElement('p')
  supporters.innerText = quote.supporters
  supporters.id = `sup-${quote.id}`

  let supportBtn = document.createElement('button')
  supportBtn.innerText = "Support"
  supportBtn.id = `sb-${quote.id}`
  supportBtn.addEventListener('click', addSupport)

  let deleteBtn = document.createElement('button')
  deleteBtn.innerText = "Delete"
  deleteBtn.id = `db-${quote.id}`
  deleteBtn.addEventListener('click', deleteQuote)

  container.append(content, author, supporters, supportBtn, deleteBtn)
  getList().appendChild(card)
}

function makeQuote(e){
  e.preventDefault()
  let quote = document.querySelector('#new-quote').value
  let author = document.querySelector('#author').value

  postQuote(quote, author)
}

function postQuote(quote, author){
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({quote: quote, author: author, supporters: 0})
  })
    .then(resp => resp.json())
    .then(json => renderQuote(json))
}

function addSupport(event){
  let id = event.target.id.split('-')[1]
  let supporters = document.querySelector(`#sup-${id}`)
  let sups = parseInt(supporters.innerText)
  supporters.innerText = ++sups

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({supporters: sups})
  })
}

function deleteQuote(event){
  let id = event.target.id.split('-')[1]
  let card = document.querySelector(`#card-${id}`)
  card.remove()
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE"
  })
}


function getList(){
  return document.querySelector('#quote-list')
}

function getForm(){
  return document.querySelector('form')
}
