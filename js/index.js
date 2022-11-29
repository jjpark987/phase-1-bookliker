document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.querySelector('#list')
    const bookPanel = document.querySelector('#show-panel')
    const userSelect = document.createElement('select')
    let allUsers
    let currentId = 1
    let currentUsername = 'pouros'
    let currentLikers

    fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(data => {
        for(const book of data) {
            const bookTitle = document.createElement('li')
            bookTitle.textContent = book.title
            bookTitle.addEventListener('click', () => {
                bookPanel.textContent = ''
                
                const thumbnail = document.createElement('img')
                thumbnail.src = book.img_url

                const title = document.createElement('h2')
                title.textContent = book.title

                const subtitle = document.createElement('h3')
                subtitle.textContent = book.subtitle

                const description = document.createElement('p')
                description.textContent = book.description

                const likers = document.createElement('ul')
                for(const user of book.users) {
                    const liker = document.createElement('li')
                    liker.textContent = user.username
                    likers.appendChild(liker)
                }
                
                fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(data => {
                    allUsers = data
                    for(const user of data) {
                        const option = document.createElement('option')
                        option.value = user.id
                        option.textContent = user.username
                        userSelect.appendChild(option)
                    }
                })
                .catch(() => alert('There was an error with the GET request.'))
                
                userSelect.onchange = event => {
                    currentId = parseInt(event.target.value)
                    for(const user of allUsers) {
                        if(currentId === user.id) {
                            currentUsername = user.username
                        }
                    }
                }

                const likeButton = document.createElement('button')
                likeButton.textContent = 'LIKE'
                currentLikers = book.users
                likeButton.addEventListener('click', () => {
                    if(likeButton.textContent === 'LIKE') {
                        currentLikers.push({
                            id: currentId,
                            username: currentUsername
                        })
    
                        likers.textContent = ''
                        for(const user of currentLikers) {
                            const liker = document.createElement('li')
                            liker.textContent = user.username
                            likers.appendChild(liker)
                        }
    
                        fetch(`http://localhost:3000/books/${book.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                'users': currentLikers
                            })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(() => alert('There was an error with the PATCH request.'))
                        console.log(currentLikers)
                        likeButton.textContent = 'UNLIKE'
                    } else {
                        currentLikers = currentLikers.filter(user => {
                            return currentId !== user.id
                        })

                        likers.textContent = ''
                        for(const user of currentLikers) {
                            const liker = document.createElement('li')
                            liker.textContent = user.username
                            likers.appendChild(liker)
                        }

                        fetch(`http://localhost:3000/books/${book.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                'users': currentLikers
                            })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(() => alert('There was an error with the PATCH request.'))

                        likeButton.textContent = 'LIKE'
                    }
                })
                bookPanel.append(thumbnail, title, subtitle, description, likers, userSelect, likeButton)
            })
            bookList.appendChild(bookTitle)
        }
    })
    .catch(() => alert('There was an error with the GET request.'))
});
