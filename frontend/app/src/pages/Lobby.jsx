import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'

function Lobby() {
    let navigate = useNavigate()

    return(
        <>
            <Title></Title>
            <button style={{position:"relative", transform:"translate(400%, -200%)"}} onClick={()=>{
                navigate('/problem/generate')
            }}>
                문제 생성
            </button>
            <button style={{position:"relative", transform:"translate(420%, -200%)"}} onClick={()=>{
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                navigate('/')
            }}>
                로그아웃
            </button>
            <br></br>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
        </>
    )
}

export default Lobby