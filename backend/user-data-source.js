let users = [{
  id: '1',
  name: 'silla'
}, {
  id: '2',
  name: 'dean'
}, {
  id: '3',
  name: 'pepe'
}]

let todos = [{
    userId: '1',
    description: 'Washing'
  },
  {
    userId: '1',
    description: 'Cleaning'
  },
  {
    userId: '1',
    description: 'Coding'
  },
  {
    userId: '2',
    description: 'Gaming'
  },
  {
    userId: '3',
    description: 'Cooking'
  }
]

class User {
  getUser() {
    return users;
  }

  getTodos() {
    return todos;
  }
}

module.exports = User;