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
        headers: { //for all requests it is needed
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


// With Back4Up, the request PUT work as the request PATCH!!!, i.e. in Back4Up no new object is added but some Back4Up object fields are updated with new data
export async function put(url, data) {
    return await request(url, createOptions('put', data));
}

export async function del(url) {
    return await request(url, createOptions('delete'));
}

export async function register(email, username, password) {
    //TODO: To check if we are trying to register an already registered user


    const result = await post(settings.host + '/users', { email, username, password }); //POST acc. to Back4Up
    // The request and the remaining code of this method `register` will be executed only when no problems with the line above

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

    const result = await post(settings.host + '/login', { username, password }); //POST request it should be - Back4Up have not written it correctly in their documentation
    // The request and the remaining code of this method `login` will be executed only when no problems with the line above

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
    const result = await post(settings.host + '/logout', {}); //POST acc. to Back4Up

    clearUserData(); //from utils.js
    return result;
}