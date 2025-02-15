import { useNavigate } from "react-router-dom";
import Title from '../components/Title'

function Home(){
    let navigate = useNavigate()

    return (
    <>
        <Title></Title>
        <div className="card">
            <button onClick={() => navigate('/signin')}>
                로그인
            </button>
            <button onClick={() => navigate('signup')}>
                회원가입
            </button>
        </div>
    </>
    )
}

export default Home