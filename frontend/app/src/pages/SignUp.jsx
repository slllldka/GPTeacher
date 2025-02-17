import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Title from '../components/Title'

import axios from 'axios';

function SignUp() {
    let url = 'http://localhost:8000'

    let navigate = useNavigate()
    const isAuthenticated = localStorage.getItem('refresh') !== null

    useEffect(()=>{
        if (isAuthenticated){
            navigate('/lobby')
        }
    }, [navigate, isAuthenticated])

    let [email, setEmail] = useState('')
    let [disable_input_email, set_disable_input_email] = useState(false)

    let [existing_email, set_existing_email] = useState('none')

    let [codebox_type, set_codebox_type] = useState('none')
    let [code, set_code] = useState('')
    let [disable_verify_button, set_disable_verify_button] = useState(true)

    let [time_left, set_time_left] = useState(900)

    let [verification_done, set_verification_done] = useState(false)
    let [verification_fail, set_verification_fail] = useState(false)

    let [password, set_password] = useState('')
    let [check_password, set_check_password] = useState('')
    let [same_password, set_same_password] = useState(true)

    let [name, set_name] = useState('')

    let [signup_done, set_signup_done] = useState(false)

    let [navigate_time_left, set_navigate_time_left] = useState(3)

    useEffect(()=>{
        if(password === check_password){
            set_same_password(true)
        }
        else{
            set_same_password(false)
        }
    }, [password, check_password])

    useEffect(()=>{
        if(password === check_password){
            set_same_password(true)
        }
        else{
            set_same_password(false)
        }
    }, [password, check_password])

    useEffect(()=>{
        if (verification_done || codebox_type === 'none'){
            return
        }
        const intervalID = setInterval(()=>{
            console.log("?")
            set_time_left(prev_time_left=>{
                if (prev_time_left <= 0){
                    clearInterval(intervalID)
                    return 0
                }
                return (prev_time_left - 1)
            })
        }, 1000)
        
        return ()=>clearInterval(intervalID)
    }, [codebox_type, verification_done])

    return(
        <>
            <Title></Title>
            <div className="card">
                <input id="email" autoComplete="off" placeholder="이메일" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={disable_input_email}></input>
                <button style={{position:"absolute", transform:"translateY(17%)"}} hidden={verification_done}
                    onClick={async ()=>{
                        try{
                            const response = await axios.post(url+'/account/email_request', {email})
                            if (response.status == 200){
                                set_disable_input_email(true)
                                set_existing_email('none')
                                set_codebox_type("block")
                            }
                        } catch(error){
                            if (error.response.status == 400){
                                set_existing_email('block')
                            }
                            console.log(error.response.data.error)
                            console.log(error.message)
                        }
                        
                        set_time_left(900)
                    }}>이메일 인증 요청</button>
                <div style={{display: existing_email, color: "red"}}>이미 사용된 이메일입니다.</div>
                <div style={{display: codebox_type}}>
                    <div style={{color: "green"}}>인증번호가 발송되었습니다.</div>
                    <input id="code" autoComplete="off" placeholder="인증번호" maxLength={6} value={code}
                        onChange={(e)=>{
                            set_code(e.target.value)
                            if(e.target.value.length == 6){
                                set_disable_verify_button(false)
                            }
                            else{
                                set_disable_verify_button(true)
                            }
                        }}></input>
                    <span style={{position:"absolute", transform:"translate(20%, 60%)"}}>
                        {parseInt(time_left / 60)}:{String(time_left % 60).padStart(2, '0')}
                    </span>
                    <button style={{position:"absolute", transform:"translate(50%, 17%)"}} disabled={disable_verify_button}
                        onClick={async ()=>{
                            try{
                                const response = await axios.post(url+'/account/email_response', {email, code})
                                //코드 같으면
                                if (response.status == 200){
                                    set_verification_done(true)
                                    set_verification_fail(false)
                                    set_codebox_type('none')
                                }
                            } catch(error){
                                //다르면
                                if (error.response.status == 400){
                                    set_verification_fail(true)
                                    console.log(error.response.data.error)
                                    console.log(error.message)
                                }
                            }

                        }
                        }>인증하기</button>
                </div>
                <div style={{display: verification_done ? 'block' : 'none', color: "green"}}>인증이 완료되었습니다.</div>
                <div style={{display: verification_fail ? 'block' : 'none', color: "red"}}>인증번호가 다릅니다.</div>
                <div>
                    <input id="password" autoComplete="off" placeholder="비밀번호" type="password" value={password}
                    onChange={(e)=>{
                        set_password(e.target.value)
                    }}></input>
                </div>
                <div>
                    <input id="check_password" autoComplete="off" placeholder="비밀번호 확인" type="password" value={check_password}
                    onChange={(e)=>{
                        set_check_password(e.target.value)
                    }}></input>
                </div>
                <div style={{display: password === '' ? 'none' : (same_password ? 'block' : 'none'), color:'green'}}>비밀번호가 일치합니다.</div>
                <div style={{display: !same_password ? 'block' : 'none', color:'red'}}>비밀번호가 다릅니다.</div>
                <div>
                    <input id="name" autoComplete="off" placeholder="이름" type="" value={name} onChange={(e)=>set_name(e.target.value)}></input>
                </div>
                <button disabled = {signup_done}
                    onClick={async ()=>{
                        try{
                            const response = await axios.post(url+'/account/signup', {email, password, name})
                            if (response.status == 201){
                                set_signup_done(true)
                            }
                        }catch(error){
                            console.log(error.response.data.error)
                            console.log(error.message)
                        }
                        
                        set_navigate_time_left(3)
                        const intervalID = setInterval(()=>{
                            set_navigate_time_left(prev_time_left=>{
                                if(prev_time_left > 0){
                                    set_navigate_time_left(prev_time_left-1)
                                    return (prev_time_left-1)
                                }
                                else{
                                    clearInterval(intervalID)
                                    navigate('/signin')
                                    return
                                }
                            })
                        }, 1000)
                    }
                    }>가입하기</button>
                <div style={{display: signup_done ? 'block' : 'none'}}>
                    회원가입이 완료되었습니다. {navigate_time_left}초 후에 로그인 페이지로 이동합니다.
                </div>
            </div>
        </>
    )
}

export default SignUp