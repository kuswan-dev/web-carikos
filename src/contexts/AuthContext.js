import {useState, useEffect, useContext, createContext} from 'react'
import nookies from 'nookies'
import API from 'libs/Api'

const AuthContext = createContext()

export function useAuthContext() {
    return useContext(AuthContext)
}

export function AuthContextProvider(props) {
    const [auth, setAuth] = useState()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await API.get('/auth/status')
                setAuth(res.data.data)
            } catch {
                setAuth(null)
            }
        }
        const {access} = nookies.get()
        access && fetchData()
    }, [])

    return (
        <AuthContext.Provider value={{auth, dispatch: setAuth}}>
            {props.children}
        </AuthContext.Provider>
    )
}