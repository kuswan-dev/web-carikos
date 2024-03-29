import {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import {useFormContext} from 'contexts/RoomFormContext'
import styles from 'styles/setPosition.module.css'

import {Gps} from 'libs/Icons'
import Head from 'next/head'
import Alert from 'components/Alert/Alert'

const SetMap = dynamic(() => import('components/Map/SetMap'), {ssr: false})

export default function SetPosition() {
    const {form, dispatch} = useFormContext()
    const [input, setInput] = useState('')
    const [results, setResults] = useState([])
    const [alert, setAlert] = useState(false)

    function selectResult(e) {
        setResults([])
        dispatch({type: 'SET_COORDS', payload: [e.lat, e.lon]})
    }

    function handleChange(e) {
        setInput(e.target.value)
        fetch(`https://nominatim.openstreetmap.org/search/id/${e.target.value}?format=json&limit=5&accept-language=id`)
            .then(res => res.json()).then(setResults)
    }

    function getMyPosition() {
        navigator.geolocation.getCurrentPosition(({coords}) => {
            dispatch({type: 'SET_COORDS', payload: [coords.latitude, coords.longitude]})
        }, () => setAlert(true))
    }

    useEffect(() => {
        form && fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${form.location.coords[0]}&lon=${form.location.coords[1]}&accept-language=id`)
            .then(res => res.json()).then(data => {
                setInput(data.display_name)
                setResults([])
            })
    }, [form])

    return (
        <>
            <Head>
                <title>Set Position</title>
            </Head>
            <main>
                <div className={styles.search}>
                    <input placeholder="Cari tempat.." value={input} onChange={handleChange} onFocus={e => e.target.select()}/>
                    <div className={styles.results}>
                        {results.map(place => (
                            <div key={place.place_id} onClick={() => selectResult(place)}>
                                <p>{place.display_name}</p>
                                <img src={place.icon} alt=""/>
                            </div>
                        ))}
                    </div>
                </div>
                {form && <div className={styles.map}>
                    <SetMap
                        center={form.location.coords}
                        setPosition={dispatch}
                    />
                    <i onClick={getMyPosition}><Gps/></i>
                </div>}
            </main>
            {alert && <Alert
                message='Silahkan aktifkan lokasi perangkat!'
                onClose={() => setAlert(false)}
            />}
        </>
    )
}