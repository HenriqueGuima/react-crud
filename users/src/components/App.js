import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { uuid } from "uuidv4";
import api from "../api/users";
import "./App.css";
import Header from "./Header";
import AddUser from "./AddUser";
import UserList from "./UserList";
import UserDetail from "./UserDetail";
import EditUser from "./EditUser";

function App() {
    const LOCAL_STORAGE_KEY = "users";
    const [users, setUsers] = useState([]);

    //Get Users
    const retrieveUsers = async() => {
        const response = await api.get("/users");
        return response.data;
    };

    //Handlers

    const addUserHandler = async(user) => {
        console.log(user);
        const request = {
            id: uuid(),
            ...user,
        };

        const response = await api.post("/users", request);
        console.log(response);
        setUsers([...users, response.data]);
    };

    const updateUserHandler = async(user) => {
        const response = await api.put(`/users/${user.id}`, user);
        const { id, name, type } = response.data;
        setUsers(
            users.map((user) => {
                return user.id === id ? {...response.data } : user;
            })
        );
    };

    const removeUserHandler = async(id) => {
        await api.delete(`/users/${id}`);
        const newUserList = users.filter((user) => {
            return user.id !== id;
        });

        setUsers(newUserList);
    };

    //Gets all users

    useEffect(() => {
        const getAllUsers = async() => {
            const allUsers = await retrieveUsers();
            if (allUsers) setUsers(allUsers);
        };
        getAllUsers();
    }, []);

    //Routing

    return ( <
        div className = "ui container" >
        <
        Router >
        <
        Header / >
        <
        Switch >
        <
        Route path = "/"
        exact render = {
            (props) => ( <
                UserList {...props }
                users = { users }
                getUserId = { removeUserHandler }
                />
            )
        }
        />{" "} <
        Route path = "/add"
        render = {
            (props) => ( <
                AddUser {...props }
                addUserHandler = { addUserHandler }
                />
            )
        }
        />{" "} <
        Route path = "/edit"
        render = {
            (props) => ( <
                EditUser {...props }
                updateUserHandler = { updateUserHandler }
                />
            )
        }
        />{" "} <
        Route path = "/user/:id"
        component = { UserDetail }
        />{" "} <
        /Switch>{" "} <
        /Router>{" "} <
        /div>
    );
}

export default App;