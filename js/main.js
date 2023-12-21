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
        this.contactsData = [];
    }

    async getData(){
        try{
            const responce = await fetch('https://jsonplaceholder.typicode.com/users');
            if(responce.status >= 400 && responce.status <= 420 || responce.status >= 500 && responce.status <= 520){
                throw new Error('error');
            }
            const serverData = await responce.json();
            const data = this.serverDataMapper(serverData);
            return data;
        } catch(error){
            console.error(error);
        }
    }

    serverDataMapper(data){
        return data.map(({address: {city, street}, name, id, phone,email}) =>
            new User({
                address: `${city} ${street}`,
                name,
                id: `${id}`,
                phone,
                email
            }))
    }

    createUserFromLocalStorage(){
        const localStorageData = JSON.parse(localStorage.getItem('contactsItem'));
        if(!localStorageData) {
            return undefined;
        }

        const userFromLocalStorage = localStorageData.map((item) => {
            return new User(item.data);
        })
        return userFromLocalStorage;
    }

    async getValidateContactData(){
        const isContactsCookie = !!this.getCookie('contactCookie');
        if(isContactsCookie){
            return this.createUserFromLocalStorage() ?? [];
        }
        localStorage.removeItem('contactsItem');
        return await this.getData();
    }

    setLocalStorage() {
        localStorage.setItem('contactsItem', JSON.stringify(this.contactsData)) 
        this.setCookie()
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    setCookie() {
        document.cookie = `contactCookie = contacts; max-age=${25}`
    }

    add(userData){
        this.contactsData.push(new User(userData));
        this.setLocalStorage();
    }

    editContactUser(id, updatedUserData){
        this.contactsData = this.contactsData.map((user) => {
            if(user.data.id === id){
                user.edit(updatedUserData);
            }

            return user;
        })
        this.setLocalStorage();
    }

    remove(id){
        this.contactsData = this.contactsData.filter(({data: {id:userId}})=> userId!==id )
        this.setLocalStorage();
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
        this.startApp();
        this.self = this;
    }

    startApp(){
        const preloader = document.createElement('div');
        preloader.classList.add('preloader');
        preloader.innerHTML = `<h2 class='preloader__text'>Data is loading...</h2>`;
        document.body.appendChild(preloader);
        this.getValidateContactData().then((data) => {
            preloader.remove();
            this.contactsData = data;
            this.setLocalStorage();
            this.get();
        })
    }

    createRootElement(){
        const rootElement = document.createElement('div');
        rootElement.classList.add('contacts');
        rootElement.innerHTML = `<div class="container">
                                    <div class="contact__wrapper">
                                        <div class="contact__header">
                                            <h2>Контакты</h2>
                                            <div class="contacts__form">
                                                <input type="text" class="contact__name" placeholder="Имя">
                                                <input type="text" class="contact__phone" placeholder="Телефон">
                                                <input type="text" class="contact__email" placeholder="Email">
                                                <input type="text" class="contact__address" placeholder="Адрес">
                                                <button class="contact__btn">Добавить контакт</button>
                                            </div>
                                        </div>
                                        <div class="contact__body"></div>
                                    </div>
                                 </div>`
        return rootElement;
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
            id: `${new Date().getTime()}`,
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
        this.get();
    }

    get(){
        const getContactsData = super.get();
        const contactsBodyElement = document.querySelector('.contact__body');
        let ulContacts = document.querySelector('.contacts__items');

        if(!ulContacts){
            ulContacts = document.createElement('ul');
            ulContacts.classList.add('contacts__items');
        } else {
            ulContacts.innerHTML = '';
        }
        let contactList = '';

        getContactsData.forEach(({data}) => {
            const {name, phone, email, id, address} = data;
            contactList += `<li class="item">
                                <div class="item__name">Имя: ${name}</div>
                                <div class="item__phone">Телефон: ${phone}</div>
                                <div class="item__email">Email: ${email}</div>
                                <div class="item__address">Адрес: ${address}</div>
                                <div class="item_btns">
                                    <button class="btn__delete" id="${id}">Удалить</button>
                                    <button class="btn__edit" data-edit="${id}">Редактирование</button>
                                </div>
                            </li>`
        });
        ulContacts.innerHTML = contactList;
        contactsBodyElement.appendChild(ulContacts);
        this.addDeleteEventBtns();
        this.addEditEventBtns();
    }

    onRemove(id){
        this.remove(id);
        this.get();
    }

    onStartEdit(editId){
        const getContactsData = super.get();
        const editUserData = getContactsData.find(({data: {id}}) => id === editId).data;
        const modal = new Modal(editUserData, this.onStartEdit.bind(this));
    }

    onEdit({id, ...updateData}){
        this.self.editContactUser(id, updateData);
        this.self.get();
    }

    addEditEventBtns(){
        const editContactBtns = document.querySelectorAll('.btn__edit');
        editContactBtns.forEach((editBtn) => {
            editBtn.addEventListener('click', (event) => {
                this.onStartEdit(event.target.dataset.edit);
            })
        })
    }

    addDeleteEventBtns(){
        const deleteContactBtns = document.querySelectorAll('.btn__delete');
        deleteContactBtns.forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', (event) => {
                this.onRemove(event.target.id);
            })
        })
    }
}

class Modal {
    constructor(contactData, edit){
        this.contactData = contactData;
        this.heandleUserEdit = edit;
        this.modalHtmlElement = this.createModalHTML(this.contactData);
        document.body.appendChild(this.modalHtmlElement);
        this.addCancelEvent();
        this.addSaveEvent();
    }

    addCancelEvent(){
        const cancelBtn = document.querySelector('.modal__cancel__btn');
        cancelBtn.addEventListener('click', (_) => {
            this.modalHtmlElement.remove();
        })
    }

    addSaveEvent(){
        const saveBtn = document.querySelector('.modal__save__btn');
        saveBtn.addEventListener('click', (event) => {
            const name = document.querySelector('.modal__edit__name').value;
            const phone = document.querySelector('.modal__edit__phone').value;
            const email = document.querySelector('.modal__edit__email').value;
            const address = document.querySelector('.modal__edit__address').value;
            this.heandleUserEdit({
                name,
                phone,
                email,
                address,
                id: event.target.id,
            });
            this.modalHtmlElement.remove();
        })
    }

    createModalHTML({name, phone, address, email, id}){
        const modalHTML = document.createElement('div');
        modalHTML.classList.add('modal');
        modalHTML.innerHTML = `<div class="modal__wrapper">
                                    <div class="modal__header">
                                        <h3>Редактирование пользователя</h3>
                                    </div>
                                    <div class="modal__content">
                                        <input type="text" class="modal__edit__name" value ="${name}">
                                        <input type="phone" class="modal__edit__phone" value="${phone}">
                                        <input type="email" class="modal__edit__email" value="${email}">
                                        <input type="text" class="modal__edit__address" value="${address}">
                                        <div class="modal__btns">
                                            <button class="modal__cancel__btn">Отмена</button>
                                            <button class="modal__save__btn" id="${id}">Сохранить</button>
                                        </div>
                                    </div>        
                                </div>`
        return modalHTML;
    }
}


const app = new ContactApp();
