import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserView() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(user);

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  return (
    <>
      {user.id && (
        <h1>
          Usuario: {user.name} {user.lastname}
        </h1>
      )}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {!loading && (
          <>
            <div className="user-data">
              <div className="user-info">
                <strong style={{fontSize:'24px'}} >Teléfono:</strong>
                <span style={{fontSize : '20px'}}>{user.phone}</span>

                <strong style={{fontSize:'24px'}}>Nacimiento:</strong>
                <span style={{fontSize : '20px'}}>{user.dateofbirth}</span>

                <strong style={{fontSize:'24px'}}>Estado civil:</strong>
                <span style={{fontSize : '20px'}}>{user.civilstatus}</span>

                <strong style={{fontSize:'24px'}}>Email:</strong>
                <span style={{fontSize : '20px'}}>{user.email}</span>

                <strong style={{fontSize:'24px'}}>Registrado:</strong>
                <span style={{fontSize : '20px'}}>{user.created_at}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
