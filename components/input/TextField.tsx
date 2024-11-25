import { StyleSheet, TextInput, View, Text } from 'react-native';

interface TextFieldProps {
    placeholder: string;
    value: string,
    onChangeText: (value: string) => void,
    feedback: string,
    isPassword?: boolean,
};

export default function TextField({
    placeholder,
    value,
    onChangeText,
    feedback,
    isPassword = false,
}: TextFieldProps) {
    return (
        <View style={styles.textFieldContainer}>
            <TextInput style={styles.textFieldInput}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isPassword}
            />
            {feedback && <Text style={styles.textFieldFeedback}>{feedback}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    textFieldContainer: {
        width: '90%',
        alignItems: 'center'
    },
    textFieldInput: {
        fontSize: 24,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#dde7c7',
        borderBottomColor: '#001219',
        borderBottomWidth: 3,
        borderRadius: 5,
        width: '90%',
    },
    textFieldFeedback: {
        paddingRight: 30,
        alignSelf: 'stretch',
        textAlign: 'right',
        fontSize: 18,
        color: "#ca6702",
    }
});