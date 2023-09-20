import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import {useEffect} from "react";

export default function DefaultLayout() {
  const {user, token, setUser, setToken, notification, $can } = useStateContext();

  if (!token) {
    return <Navigate to="/login"/>
  }

  const onLogout = async (ev) => {
    ev.preventDefault()
    await axiosClient.post('/logout');
    setUser(null)
    setToken(null)
    setPermissions(null)
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])

  return (
    <div id="defaultLayout">
      <aside>
        {$can('dashboard') ? <Link to="/dashboard" >Grafico poblacion Mundial</Link> : null}
        {$can('dashboard') ? <Link to="/table" >Tabla de Datos Poblacion</Link> : null}
        {$can('users') ? <Link to="/users">Usuarios</Link> : null}
      </aside>
      <div className="content">
        <header>
          <div>
            Prueba Tecnica Leonardo Sanchez &nbsp; &nbsp;
          </div>

          <div>
            <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
          </div>
        </header>
        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}
