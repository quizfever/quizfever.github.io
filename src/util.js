// We level up the abstraction so that we have an easier access to some functions connected with requests
export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData')); 
}

// We level up the abstraction so that we have an easier access to some functions connected with requests
export function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

// We level up the abstraction so that we have an easier access to some functions connected with requests
export function clearUserData() {
    sessionStorage.removeItem('userData');
}