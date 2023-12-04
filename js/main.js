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


class ContactApp extends Contacts {
    constructor(){
        super();
        this.app = this.createRootElement();

        document.body.appendChild(this.app);
        this.addContactEvent();
    }

    createRootElement(){
        const rootElement = document.createElement('div');
        rootElement.classList.add('contacts');
        rootElement.innerHTML = `
            <div class='container'>
                <div class='contacts__wrapper'>

                    <div class='contacts__header'>
                        <h2>Контакты</h2>
                        <div class='contacts__form'>
                            <input type='text' class='contact__name' placeholder='Имя'>
                            <input type='text' class='contact__phone' placeholder='Телефон'>
                            <input type='text' class='contact__email' placeholder='Почта'>
                            <input type='text' class='contact__address' placeholder='Адрес'>
                            <button class='contact__btn'>Добавить контакт</button>
                        </div>
                    </div>

                    <div class='contact__body'>
                        <h2>Список контактов</h2>
                    </div>

                </div>
            </div>
        `;
        return rootElement
    }

    addContactEvent(){
        const addBtn = document.querySelector('.contact__btn');
        addBtn.addEventListener('click', ()=>{
            this.onAdd();
        })
    }
    
    onAdd(){
        const name = document.querySelector('.contact__name');
        const phone = document.querySelector('.contact__phone');
        const email = document.querySelector('.contact__email');
        const address = document.querySelector('.contact__address');

        const userData = {
            id: new Date().getTime().toString(),
            name: name.value,
            phone: phone.value,
            email: email.value,
            address: address.value
        }

        this.add(userData)
        name.value = '';
        phone.value = '';
        email.value = '';
        address.value = '';
    }

    get(){
        const getContactsData = super.get();
        console.log('bla-bla');
        console.log(getContactsData);
    }
}


const app = new ContactApp();
