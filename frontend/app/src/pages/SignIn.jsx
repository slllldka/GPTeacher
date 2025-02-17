import { useNavigate } from "react-router-dom"
import Title from '../components/Title'
import axios from "axios"
import { useEffect, useState } from "react"

function SignIn() {
    let url = 'http://localhost:8000'

    let navigate = useNavigate()
    const isAuthenticated = localStorage.getItem('refresh') !== null

    useEffect(()=>{
        if (isAuthenticated){
            navigate('/lobby')
        }
    }, [navigate, isAuthenticated])

    let [email, set_email] = useState('')
    let [password, set_password] = useState('')
    let [email_or_password_wrong, set_email_or_password_wrong] = useState(false)

    return(
        <>
            <Title></Title>
            <div className="card">
                <div>
                    <input id="email" autoComplete="email" placeholder="이메일" type="email" value={email}
                    onChange={(e)=>set_email(e.target.value)}></input>
                </div>
                <div>
                    <input id="password" autoComplete="off" placeholder="비밀번호" type="password" value={password}
                    onChange={(e)=>set_password(e.target.value)}></input>
                </div>
                <br></br>
                <div style={{display: email_or_password_wrong ? 'block' : 'none', color: "red"}}>
                    이메일 또는 비밀번호가 일치하지 않습니다.
                </div>
                <button onClick={async () => {
                    try{
                        const response = await axios.post(url+'/account/signin', {email, password})
                        if (response.status == 200){
                            localStorage.setItem('access', response.data.access)
                            localStorage.setItem('refresh', response.data.refresh)
                            console.log('access: '+localStorage.getItem('access'))
                            console.log('refresh: '+localStorage.getItem('refresh'))
                            navigate('/lobby')
                        }
                    } catch(error){
                        set_email_or_password_wrong(true)
                        console.log(error.message)
                    }
                }}>
                    로그인
                </button>
                <button onClick={() => navigate('/signup')}>
                    회원가입
                </button>
            </div>
        </>
    )
}

export default SignIn