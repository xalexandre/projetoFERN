import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TextField from '@/components/input/TextField';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {

    const [inputUser, setInputUser] = useState<string>("");
    const [inputPassword, setInputPassword] = useState<string>("");
    const [inputUserFeedback, setInputUserFeedback] = useState<string>("");
    const [inputPasswordFeedback, setInputPasswordFeedback] = useState<string>("");

    const loginSubmit = () => {
        setInputUserFeedback("");
        setInputPasswordFeedback("");
        if (inputUser && inputPassword) {
            router.push('/(private)');
        } else {
            if (!inputUser) setInputUserFeedback("Preencha este campo.");
            if (!inputPassword) setInputPasswordFeedback("Preencha este campo.");
        }
    }

    return (
        <View style={styles.loginContainer}>
            <Image style={styles.loginImageIcon} resizeMode='contain' source={require('@/assets/images/login-logo.png')} />
            <Text style={styles.loginHeader}>Acesso</Text>
            <TextField
                placeholder='Usuário'
                value={inputUser}
                onChangeText={setInputUser}
                feedback={inputUserFeedback}
            />
            <TextField
                placeholder='Senha'
                value={inputPassword}
                onChangeText={setInputPassword}
                feedback={inputPasswordFeedback}
                isPassword
            />
            <Pressable style={styles.loginBtnSubmit} onPress={loginSubmit}>
                <Text style={styles.loginBtnSubmitLabel}>Acessar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        alignItems: 'center',
    },
    loginImageIcon: {
        height: 200,
    },
    loginHeader: {
        fontSize: 28,
        padding: 10,
        fontWeight: '700',
    },
    loginBtnSubmit: {
        padding: 10,
        marginVertical: 20,
        backgroundColor: "#aaf683",
        width: "50%",
        borderRadius: 10,
        shadowColor: "#343a40",
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 4,
    },
    loginBtnSubmitLabel: {
        fontSize: 20,
        textAlign: 'center',
    }
})