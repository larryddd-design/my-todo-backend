class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // hashed
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
module.exports = User;
