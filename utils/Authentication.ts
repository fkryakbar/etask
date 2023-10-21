import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import FirebaseApp from "./Firebase";
import { Toast } from "./Swal";
import { onValue, ref, set } from "firebase/database";
import RealtimeDB from "./RealtimeDB";
import { useEffect, useState } from "react";


const auth = getAuth(FirebaseApp);


const signUpNewUser = async (name: string, email: string, password: string, confirmPassoword: string, setIsLoadingFunction: any, form: any) => {
    if (name == '' || email == '' || confirmPassoword == '' || password == '') {
        Toast.fire({
            icon: 'error',
            title: 'All fields are required'
        })
        return false
    }

    if (password != confirmPassoword) {
        Toast.fire({
            icon: 'error',
            title: 'Passwords do not match'
        })
        return false
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            await set(ref(RealtimeDB, 'users/' + user.uid), {
                name: name,
                email: email,
            });
            Toast.fire({
                icon: 'success',
                title: 'Account successfully created'
            })
            form.reset()
            setIsLoadingFunction(false)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            if (errorCode == 'auth/weak-password') {
                Toast.fire({
                    icon: 'error',
                    title: 'Password should be at least 6 characters'
                })
            }
            if (errorCode == 'auth/email-already-in-use') {
                Toast.fire({
                    icon: 'error',
                    title: 'Email already in use'
                })
            }
            setIsLoadingFunction(false)
        });
}

const sigInUser = async (email: string, password: string) => {
    if (email == '' || password == '') {
        Toast.fire({
            icon: 'error',
            title: 'All fields are required'
        })
        return false
    }

    await signInWithEmailAndPassword(auth, email, password).then(() => {
        Toast.fire({
            icon: 'success',
            title: 'Successfully signed in'
        })
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode == 'auth/invalid-login-credentials') {
            Toast.fire({
                icon: 'error',
                title: 'Invalid email or password'
            })
        }
        return false
    });
}

const useUser = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        setIsLoading(true)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(RealtimeDB, 'users/' + user.uid);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val()
                        setUserData({
                            ...user,
                            email: data.email,
                            name: data.name
                        })
                    }
                    setIsLoading(false)
                })
            } else {
                setIsLoading(false)

            }

        })
    }, [])


    return { userData, isLoading }
}

const signOutUser = async () => {
    await signOut(auth).then(() => {
        window.location.href = '/login'
    }).catch((err) => {
        console.log(err)
    })

}

export { signUpNewUser, useUser, sigInUser, signOutUser }