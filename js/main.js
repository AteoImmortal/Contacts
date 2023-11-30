
    // id: 1,
    // name: 'Denis',
    // phone: '+375445889335',
    // email: 'ateo.immortal228@gmail.com',
    // address: 'Minsk'

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

class Contacts{
    constructor(){
        this.contactsData = [
            new User ({
                id: '1',
                name: 'Denis',
                phone: '+375445889335',
                email: 'ateo.immortal228@gmail.com',
                address: 'Minsk'
            })
        ];
    }

    add(userData){
        this.contactsData.push(new User(userData));
    }

    editContactUser(id, updatedUserData){
        this.contactsData = this.contactsData.map((user) => {
            if(user.data.id === id){
                user.edit(updatedUserData);
            }

            return user;
        })
    }

    remove(id){
        this.contactsData = this.contactsData.filter(({data: {id:userId}})=> userId!==id )
    }

    get(){
        return this.contactsData;
    }
}


