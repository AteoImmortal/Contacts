class User {
    constructor(data) {
        this.data = data;

    }

    edit(updatedData){
        this.data = {
            ...this.data,
            ...updatedData,
        };
    }

    get(){
        return this.data;
    }
}

const userData = {
    id: 1,
    name: 'Denis',
    phone: '+375445889335',
    email: 'ateo.immortal228@gmail.com',
    address: 'Minsk'
}

const user1 = new User(userData)

console.log(user1)