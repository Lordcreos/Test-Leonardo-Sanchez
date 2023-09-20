import {createContext, useContext, useState} from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setPermissions: () => {},
  setNotification: () => {},
  $can: () => {},
})

export const ContextProvider = ({children}) => {
  const [user, _setUser] = useState(localStorage.getItem('ACCESS_USER'));
  const [permissions, _setPermissions] = useState(localStorage.getItem('ACCESS_PERMISSIONS'));
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [notification, _setNotification] = useState('');

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }
  const setUser = (user) => {
    let u = JSON.stringify(user);
    _setUser(u)
    if (u) {
      localStorage.setItem('ACCESS_USER', u);
    } else {
      localStorage.removeItem('ACCESS_USER');
    }
  }
  const setPermissions = (permissions) => {
    let p = JSON.stringify(permissions);
    _setPermissions(p)
    if (p) {
      localStorage.setItem('ACCESS_PERMISSIONS', p);
    } else {
      localStorage.removeItem('ACCESS_PERMISSIONS');
    }
  }

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  const $can = (p) =>{
    if(p){
      let result = permissions ? JSON.parse(permissions).permissions : null;
      if(result){
        if(result.indexOf(p) !== -1){
          return true;
        }
      }
    }
    return false;
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      notification,
      setNotification,
      setPermissions,
      permissions,
      $can
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
