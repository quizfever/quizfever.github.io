import { clearUserData, getUserData, setUserData } from '../util.js';


export const settings = { host: '' }

async function request(url, options) {
    try {
        const response = await fetch(url, options);

        if (response.ok == false) {
            if (response.status == 403) { //forbidden access to the server
                clearUserData(); //from utils.js
            }

            const error = await response.json();
            throw new Error(error.error);
        }

        try {
            const data = await response.json();
            return data;
        } catch (err) {
            return response;
        }
    } catch (err) {
        alert(err.message);
        throw err;
    }
}

function createOptions(method = 'get', data) {
    const options = {
        method,
        headers: { //за всички заявки е нужно
            'X-Parse-Application-Id': 'Nw8icJOEcXZKC7JY7w0pEY8YRdRzri5CEz0b7X5a',
            'X-Parse-REST-API-Key': 'TVMYThHlNBf929LdyY0oUmlenSr421jGSzFgsinm'
        }
    };

    const userD = getUserData();
    // console.log('userD', userD);    

    if (userD != null) {
        options.headers['X-Parse-Session-Token'] = userD.authToken; //Back4Up - section retrieving current user
        // console.log('token', userD.authToken);
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    return options;
}

export async function get(url) {
    return await request(url, createOptions());
}

export async function post(url, data) {
    return await request(url, createOptions('post', data));
}


// С Back4Up заявката put работи като заявка patch!!! т.е. не се добавя нов обект, а се коригират някои от полетата на обекта с новите данни
export async function put(url, data) {
    return await request(url, createOptions('put', data));
}

export async function del(url) {
    return await request(url, createOptions('delete'));
}

export async function register(email, username, password) {
    //to check if we are trying to register an already registered user


    const result = await post(settings.host + '/users', { email, username, password }); //post acc. to Back4Up
    //Оттук надолу заявката ще се изпълни успешно само ако сме минали през горния ред успешно

    const userData = {
        userId: result.objectId,
        createdAt: result.createdAt,
        authToken: result.sessionToken,
        email: email,
        username: username
    };

    /* Back4Up
    { "objectId":"nr7hAYS43a",
    "createdAt":"2018-11-08T13:08:42.914Z",
    "sessionToken":"r:35c2ae1c1def6c38a469e41ce671cb7e" }*/

    setUserData(userData); //from utils.js

    return userData;
}


export async function login(username, password) {
    const currUserData = getUserData();
    if (currUserData) {
        return alert(`You have already logged in with a username ${currUserData.username}. If you want to log-in with a different account, then please, logout first, and then login again`);
    }

    const result = await post(settings.host + '/login', { username, password }); //POST трябва да е - Back4Up не са го написали правилно
    //Оттук надолу заявката ще се изпълни успешно само ако сме минали през горния ред успешно

    const userData = {
        userId: result.objectId,
        username: username,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        authToken: result.sessionToken
    };

    /* Back4Up
    {
        "objectId":"AHRLeYvh0d",
        "username":"newUserName",
        "createdAt":"2018-11-08T13:50:56.843Z",
        "updatedAt":"2018-11-08T13:50:56.843Z",
        "sessionToken":"r:8d975a0f207fab1211752da3be0a3c81"
    } */

    setUserData(userData); //from utils.js
    return userData;
}


export async function logout() {
    const result = await post(settings.host + '/logout', {}); //post acc. to Back4Up

    clearUserData(); //from utils.js
    return result;
}