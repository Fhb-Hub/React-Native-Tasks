import React, { Component } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from "@react-native-community/async-storage"

import todayImage from './../../../assets/imgs/today.jpg'
import styles from './style'
import Task from './../../components/Task'
import AddTask from './../AddTask'

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTask: [],
    tasks: []
}

export default class TaskList extends Component {
    state = {
        ...initialState
    }

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState') 
        const state = JSON.parse(stateString) || initialState
        this.setState(state, this.filterTasks)
    }
    
    toggleFilter = () => {
        this.setState(
            { showDoneTasks: !this.state.showDoneTasks },
            this.filterTasks)
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(item => item.id !== id) 
        this.setState({tasks}, this.filterTasks)
    }

    addTask = newTask => {
        const tasks = [...this.state.tasks]

        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({ tasks, showAddTask: false }, this.filterTasks)
    }

    isPending = task => (task.doneAt === null)

    filterTasks = () => {
        this.setState({
            visibleTask: this.state.showDoneTasks
                ? [...this.state.tasks]
                : this.state.tasks.filter(this.isPending)
        })
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state) )
    }

    toggleCheck = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if (task.id === taskId) {
                task.doneAt = task.doneAt ? null : new Date()
            }
        })
        this.setState({ tasks }, this.filterTasks)
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
        return (
            <SafeAreaView style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onCalcel={() => this.setState({ showAddTask: false })}
                    onSave={this.addTask} />
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon
                                name={this.state.showDoneTasks ? "eye" : "eye-slash"}
                                size={20}
                                color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTask}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) =>
                            <Task {...item} 
                            onToggleCheck={this.toggleCheck} 
                            onDelete={this.deleteTask}
                            />} />
                </View>
                <TouchableOpacity style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={() => this.setState({ showAddTask: true })}>
                    <Icon name="plus"
                        size={20}
                        color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}