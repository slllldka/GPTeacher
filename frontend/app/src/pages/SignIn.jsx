import { useNavigate } from "react-router-dom"
import Title from '../components/Title'

function SignIn() {
    let navigate = useNavigate()
    return(
        <>
            <Title></Title>
            <div className="card">
                <div>
                    <input placeholder="이메일" type="email"></input>
                </div>
                <div>
                    <input placeholder="비밀번호" type="password"></input>
                </div>
                <br></br>
                <button onClick={() => navigate('/')}>
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