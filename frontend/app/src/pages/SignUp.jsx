import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Title from '../components/Title'

function SignUp() {
    let navigate = useNavigate()

    let [available_email, set_available_email] = useState('none')
    let [unavailable_email, set_unavailable_email] = useState('none')
    let [codebutton_type, set_codebutton_type] = useState(true)
    let [codebox_type, set_codebox_type] = useState('none')
    let [time_left, set_time_left] = useState(9000)
    let [verification_done, set_verification_done] = useState(false)
    return(
        <>
            <Title></Title>
            <div className="card">
                <input placeholder="이메일" type="email"></input>
                <button style={{position:"absolute", transform:"translateY(17%)"}} hidden={verification_done}
                    onClick={()=>{
                        set_available_email('block')
                        set_codebutton_type(false)
                    }
                    }>이메일 중복 확인</button>
                <button style={{position:"absolute", transform:"translateY(17%)"}} hidden={codebutton_type || verification_done}
                    onClick={()=>set_codebox_type("block")}>이메일 인증 요청</button>
                <div style={{display: available_email, color: "green"}}>사용 가능한 이메일입니다.</div>
                <div style={{display: unavailable_email, color: "red"}}>이미 사용된 이메일입니다.</div>
                <div style={{display: codebox_type}}>
                    <input placeholder="인증번호"maxLength={6}></input>
                    <span style={{position:"absolute", transform:"translate(20%, 60%)"}}>15:00</span>
                    <button style={{position:"absolute", transform:"translate(50%, 17%)"}}
                        onClick={()=>{
                            //코드 같으면
                            set_verification_done(true)
                            set_available_email('none')
                            set_codebox_type('none')

                            //다르면

                        }
                        }>인증하기</button>
                </div>
                <div style={{display: verification_done ? 'block' : 'none', color: "green"}}>인증이 완료되었습니다.</div>
                <div style={{display: verification_done ? 'block' : 'none', color: "red"}}>인증번호가 다릅니다.</div>
                <div>
                    <input placeholder="비밀번호" type="password"></input>
                </div>
                <div>
                    <input placeholder="비밀번호 확인" type="password"></input>
                </div>
                <div style={{color:'green'}}>비밀번호가 일치합니다.</div>
                <div style={{color:'red'}}>비밀번호가 다릅니다.</div>
                <div>
                    <input placeholder="이름" type=""></input>
                </div>
                <button
                    onClick={()=>{
                        navigate('/signin')
                    }
                    }>가입하기</button>
            </div>
        </>
    )
}

export default SignUp