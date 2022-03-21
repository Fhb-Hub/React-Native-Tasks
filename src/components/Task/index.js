import React from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'

import { ListItem, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'

import styles from './style'

function getCheckView(doneAt) {
    return doneAt != null
        ? <View style={styles.done}>
            <Icon name='check' size={20} color="#fff" />
        </View>
        : <View style={styles.pending}></View>
}

export default props => {
    const doneOrNotStyle = props.doneAt != null ?
        { textDecorationLine: 'line-through' } : {}

    const date = props.dateAt ? props.doneAt : props.estimateAt
    const formatDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    return (
        <ListItem.Swipeable style={styles.listItem}
            leftContent={
                <Button
                    title="Edit"
                    icon={{ name: 'edit', color: 'white' }}
                    buttonStyle={{ minHeight: '100%' }}
                    onPress={() => props.onDelete && props.onDelete(props.id)} />
            }
            rightContent={
                <Button
                    title="Delete"
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: '#e00' }}
                    onPress={() => props.onDelete && props.onDelete(props.id)} />
            }>
            <ListItem.Content >
                <View style={styles.container}>
                    <TouchableWithoutFeedback
                        onPress={() => props.onToggleCheck(props.id)}>
                        <View style={styles.checkContainer}>
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                        <Text style={styles.date}>{formatDate}</Text>
                    </View>
                </View>
            </ListItem.Content>
        </ListItem.Swipeable>
    )
}
