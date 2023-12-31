const books = require('./books')
const { nanoid } = require('nanoid')
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newbook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  books.push(newbook)
  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(400)
  return response
}
const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((book) => book.id === id)[0]
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}
const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished
  } = request.query
  let filteredBooks = books
  if (name) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (reading) {
    filteredBooks = books.filter((book) => Number(book.reading) === Number(reading))
  }
  if (finished) {
    filteredBooks = books.filter((book) => Number(book.finished) === Number(finished))
  }

  const mapping = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  const response = h.response({
    status: 'success',
    data: {
      books: mapping
    }
  })
  response.code(200)
  return response
}
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}
const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const index = books.findIndex((book) => book.id === id)
  const updatedAt = new Date().toISOString()
  const insertedAt = updatedAt
  const findBookId = books.filter((book) => book.id === id)[0]
  if (findBookId === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  if (index !== -1) {
    const finished = pageCount === readPage
    books[index] = {
      ...books[index],
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getBookByIdHandler,
  getAllBooksHandler,
  deleteBookByIdHandler,
  editBookByIdHandler
}
