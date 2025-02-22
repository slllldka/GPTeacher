import { useNavigate, useParams } from "react-router-dom"
import Title from "../components/Title";
import { useEffect, useState } from "react";
import { problem_api } from "../utils/axios_api";

function ProblemView(){
    const { id } = useParams();
    
    let navigate = useNavigate()

    let [title, set_title] = useState('')
    let [problem_description, set_problem_description] = useState('')
    let [input_description, set_input_description] = useState('')
    let [output_description, set_output_description] = useState('')
    let [time_limit, set_time_limit] = useState('')
    let [memory_limit, set_memory_limit] = useState('')

    useEffect(()=>{
        const fetchData = async() => {
            try{
                const response = await problem_api.get(`/problem/${id}`)
                if (response.status == 200){
                    set_title(response.data.title)
                    set_problem_description(response.data.problem_description)
                    set_input_description(response.data.input_description)
                    set_output_description(response.data.output_description)
                    set_time_limit(response.data.time_limit)
                    set_memory_limit(response.data.memory_limit)
                }
            }catch(error){
                console.log(error.response.data.error)
                console.log(error.message)
            }
        }

        fetchData()
    }, [id])

    return(
        <>
            <Title></Title>
            <button style={{position:"relative", transform:"translate(400%, -200%)"}} onClick={()=>{
                navigate(`/problem/modify/${id}`)
            }}>
                문제 수정
            </button>
            <button style={{position:"relative", transform:"translate(400%, -200%)"}} onClick={async ()=>{
                if(window.confirm('정말로 삭제하시겠습니까?')){
                    try{
                        const response = await problem_api.delete(`/problem/${id}`)
                        if(response.status == 200){
                            window.alert('문제가 삭제되었습니다.')
                            navigate('/lobby/1')
                        }
                    }catch(error){
                        console.log(error.response.data.error)
                        console.log(error.message)
                    }
                }
            }}>
                문제 삭제
            </button>
            <br></br>
            <button style={{position:"relative", transform:"translate(400%, -150%)"}} onClick={async ()=>{
                try{
                    const response = await problem_api.post(`hint/${id}`, {id})
                    if (response.status == 201){
                        //TODO
                    }
                }catch(error){
                    console.log(error.response.data.error)
                    console.log(error.message)
                }
            }}>
                힌트 생성
            </button>
            <button style={{position:"relative", transform:"translate(400%, -150%)"}} onClick={async ()=>{
                try{
                    const response = await problem_api.get(`hint/${id}`)
                    if (response.status == 200){
                        //TODO
                    }
                }catch(error){
                    console.log(error.response.data.error)
                    console.log(error.message)
                }
            }}>
                힌트 보기
            </button>
            <br></br>
            <div style={{width:'500px', textAlign:'left'}}>
                <h3>제목</h3>
                <div>{title}</div>
                <hr style={{marginBottom:'30px'}}></hr>
                <h3>문제 설명</h3>
                <div>{problem_description}</div>
                <hr style={{marginBottom:'30px'}}></hr>
                <h3>입력 조건</h3>
                <div>{input_description}</div>
                <hr style={{marginBottom:'30px'}}></hr>
                <h3>출력 조건</h3>
                <div>{output_description}</div>
                <hr style={{marginBottom:'30px'}}></hr>
                <h3>시간 제한</h3>
                <div>{time_limit}</div>
                <hr style={{marginBottom:'30px'}}></hr>
                <h3>메모리 제한</h3>
                <div>{memory_limit}</div>
                <hr></hr>
            </div>
        </>
    )
}

export default ProblemView