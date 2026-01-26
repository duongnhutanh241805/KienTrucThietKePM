// factory-book.js

// Product
class Book {
    constructor(title) {
      this.title = title;
    }
  
    getType() {
      return "Book";
    }
  }
  
  // Concrete Products
  class PaperBook extends Book {
    getType() {
      return "Paper Book";
    }
  }
  
  class EBook extends Book {
    getType() {
      return "E-Book";
    }
  }
  
  class AudioBook extends Book {
    getType() {
      return "Audio Book";
    }
  }
  
  // Factory Method
  class BookFactory {
    static createBook(type, title) {
      switch (type) {
        case "paper":
          return new PaperBook(title);
        case "ebook":
          return new EBook(title);
        case "audio":
          return new AudioBook(title);
        default:
          throw new Error("Unknown book type");
      }
    }
  }
  
  // Demo
  const book1 = BookFactory.createBook("paper", "Design Patterns");
  const book2 = BookFactory.createBook("ebook", "Clean Code");
  const book3 = BookFactory.createBook("audio", "Refactoring");
  
  console.log(book1.getType(), "-", book1.title);
  console.log(book2.getType(), "-", book2.title);
  console.log(book3.getType(), "-", book3.title);
  