//props to https://jasonwatmore.com/post/2018/09/24/nodejs-basic-authentication-tutorial-with-example-api
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = { authenticate };

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
