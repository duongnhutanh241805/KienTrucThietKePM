// singleton-library.js

class Library {
    constructor() {
      if (Library.instance) {
        return Library.instance; // đảm bảo chỉ có 1 instance
      }
  
      this.books = [];
      Library.instance = this;
    }
  
    addBook(book) {
      this.books.push(book);
    }
  
    listBooks() {
      return this.books;
    }
  }
  
  // Demo
  const lib1 = new Library();
  lib1.addBook("Design Patterns");
  
  const lib2 = new Library();
  lib2.addBook("Clean Code");
  
  console.log("Library 1 books:", lib1.listBooks());
  console.log("Library 2 books:", lib2.listBooks());
  
  console.log("Same instance?", lib1 === lib2);
  