document.addEventListener('DOMContentLoaded', function() {

    const STORAGE_BOOKS_KEY = 'BOOKS_APPS';
    const bookshelf = [];
    const submitAddBook = document.getElementById('inputBook');
    const RENDER_EVENT = 'render-book';

    submitAddBook.addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });
    function checkForStorage() {
        return typeof(Storage) !== 'undefined';
    }
    function saveData() {
        if(checkForStorage){
            const parsed = JSON.stringify(bookshelf);
            localStorage.setItem(STORAGE_BOOKS_KEY, parsed)
        }
    }
    function loadDataFromStorage() {
        const dataBookLocal = localStorage.getItem(STORAGE_BOOKS_KEY);
        const data = JSON.parse(dataBookLocal);

        if(data !== null) {
            for(const book of data) {
                bookshelf.push(book)
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT))
        
    }

    function generateId() {
        return +new Date();
    }
    function generateBookObject(id,title,author,year,isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete
        }
    }

    document.addEventListener(RENDER_EVENT, function() {
        const incompletedBooksehlf = document.getElementById('incompleteBookshelfList');
        incompletedBooksehlf.innerHTML = '';
        const completedBookself = document.getElementById('completeBookshelfList');
        completedBookself.innerHTML = '';

        for(const bookItem of bookshelf){
            const bookElement = makeInterfaceBook(bookItem);
            if(bookItem.isComplete){
                completedBookself.append(bookElement);
            } else{
                incompletedBooksehlf.append(bookElement);
            }
        }
    });

    function addBook() {
        const id = generateId();
        const bookTitle = document.querySelector('#inputBookTitle').value;
        const bookAuthor = document.querySelector('#inputBookAuthor').value;
        const bookYear = parseInt(document.querySelector('#inputBookYear').value); 
        
        const isCompleted = document.querySelector('#inputBookIsComplete').checked;


        const bookObject = generateBookObject(id,bookTitle,bookAuthor,bookYear, isCompleted);
        bookshelf.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function makeInterfaceBook(bookObject){
        const textBookTitle = document.createElement('h3');
        textBookTitle.innerText = bookObject.title;
        const textBookAuthor = document.createElement('p');
        textBookAuthor.innerText = bookObject.author;
        const year = document.createElement('p');
        year.innerText = bookObject.year;

        const container = document.createElement('article');
        container.classList.add('book_item');
        container.setAttribute('id', `book-${bookObject.id}`)
        container.append(textBookTitle,textBookAuthor,year);

        const innerContainer = document.createElement('div');
        innerContainer.classList.add('action');

        const trashButton =document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener('click', function() {
            removeBookItem(bookObject.id);
        })

        function findBook(bookId) {
            for (const bookItem of bookshelf){
               if(bookItem.id === bookId){
                return bookItem;
               } 
            }
            return null;
        }
        function findBookIndex(bookId) {
            for (const index in bookshelf){
                if(bookshelf[index].id == bookId){
                    return index;
                }
            }
        }

        function addBookToComplete(bookId) {
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;
            bookTarget.isComplete = true;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
        function undoBookFromComplete(bookId) {
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.isComplete = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
        function removeBookItem(bookId) {
            const bookTarget = findBookIndex(bookId);
            if(bookTarget === -1) return;

            bookshelf.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }


        if(bookObject.isComplete){
            const buttonInCompleted = document.createElement('button');
            buttonInCompleted.classList.add('green');
            buttonInCompleted.innerText = "belum selesai dibaca";
            buttonInCompleted.addEventListener('click', function() {
                undoBookFromComplete(bookObject.id);
                
            });

            innerContainer.append(buttonInCompleted, trashButton)
            
        } else {
            const buttonCompleted = document.createElement('button');
            buttonCompleted.classList.add('green');
            buttonCompleted.innerText = "selesai dibaca";
            buttonCompleted.addEventListener('click', function() {  
                addBookToComplete(bookObject.id)
                
            });

            innerContainer.append(buttonCompleted, trashButton)
        }
        container.append(innerContainer)
        return container;
    }

    document.querySelector('#searchBook').addEventListener('submit', function(e){
        e.preventDefault();
        getBookFromSearch();
    });
    function getBookFromSearch() {
        const inputSearchBookTitle = document.querySelector('#searchBookTitle').value;
        const incompletedBookshelf = document.getElementById('incompleteBookshelfList');
        incompletedBookshelf.innerHTML = '';
        const completedBookshelf = document.getElementById('completeBookshelfList');
        completedBookshelf.innerHTML = '';

        for (const bookItem of bookshelf) {
            const bookElement = makeInterfaceBook(bookItem);
            if (bookItem.title.includes(inputSearchBookTitle)) {
                if (bookItem.isComplete) {
                    completedBookshelf.append(bookElement);
                } else {
                    incompletedBookshelf.append(bookElement);
                }
            } else if (inputSearchBookTitle === "") {
                document.dispatchEvent(new Event(RENDER_EVENT));
            }
        }
    }
    if(bookshelf !== null) {
        alert("oke sekarang kita testiing ok apa ngak")

    }
    if(checkForStorage) {
        loadDataFromStorage();
    }
    
});

