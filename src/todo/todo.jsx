import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'https://jagged-aries.glitch.me'
var config = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};


export default class Todo extends Component {
    constructor(props){
        super(props)
        this.state = { description: '', list: [] }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClear = this.handleClear.bind(this)

        this.refresh()
    }
    refresh(description = ''){
        axios.get(`${URL}/getTodos`, config)
            .then(resp => this.setState({...this.state, description, list: resp.data }))
    }
    handleSearch() {
        const search = description.value
        axios.get(`${URL}/getSearch?search=%${search}%`, config)
            .then(resp => this.setState({...this.state, description, list: resp.data }))
    }
    handleChange(e){
        this.setState({...this.state, description: e.target.value})
    }
    handleAdd() {
        const d = Date(Date.now()); 
        const description = this.state.description
        const done = 0
        const createdAt = d.toString()
        axios.post(`${URL}/addTodo?`, { description, done, createdAt }, config)
            .then(resp => this.refresh())
    }

    handleRemove(todo) {
        axios.get(`${URL}/deleteTodo?id=${todo.id}`, config)
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsDone(todo) {
        const done = 1
        axios.put(`${URL}/updateTodo?id=${todo.id}&done=${done}`, config)
            .then(resp => this.refresh(this.state.description))
    }
    handleMarkAsPending(todo) {
        const done = 0
        axios.put(`${URL}/updateTodo?id=${todo.id}&done=${done}`, config)
            .then(resp => this.refresh(this.state.description))
    }
    handleClear() {
        this.refresh()
    }
    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
                <TodoForm 
                    description={this.state.description} 
                    handleChange={this.handleChange}
                    handleAdd={this.handleAdd} 
                    handleSearch={this.handleSearch}
                    handleClear={this.handleClear} />
                <TodoList 
                    list={this.state.list} 
                    handleRemove={this.handleRemove} 
                    handleMarkAsDone={this.handleMarkAsDone}
                    handleMarkAsPending={this.handleMarkAsPending} />
            </div>
        )
    }

}