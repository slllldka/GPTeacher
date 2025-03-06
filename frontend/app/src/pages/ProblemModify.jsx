import Title from "../components/Title"
import { problem_api } from "../utils/axios_api"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

function ProblemModify(){
    const { id } = useParams()

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
            <div className="card">
                <h3>제목</h3>
                <input style={{width:'30vw'}} id="title" autoComplete="off" type="text" maxLength={30}
                placeholder="원하는 제목을 입력해주세요." value={title}
                onChange={(e)=>set_title(e.target.value)}></input>
                <h3>문제 설명</h3>
                <textarea style={{width:'30vw', height:'50vh', resize:'none'}} id="problem_description" autoComplete="off"
                placeholder="문제의 본문을 입력해주세요." value={problem_description}
                onChange={(e)=>set_problem_description(e.target.value)}></textarea>
                <br></br>
                <h3>입력 조건</h3>
                <textarea style={{width:'30vw', height:'20vh', resize:'none'}} id="input_description" autoComplete="off"
                placeholder="문제의 입력 조건을 입력해주세요." value={input_description}
                onChange={(e)=>set_input_description(e.target.value)}></textarea>
                <br></br>
                <h3>츨력 조건</h3>
                <textarea style={{width:'30vw', height:'20vh', resize:'none'}} id="output_description" autoComplete="off"
                placeholder="문제의 출력 조건을 입력해주세요." value={output_description}
                onChange={(e)=>set_output_description(e.target.value)}></textarea>
                <h3>시간 제한</h3>
                <input style={{width:'30vw'}} id="time_limit" autoComplete="off" type="text" maxLength={30}
                placeholder="시간 제한을 입력해주세요(초 단위)." value={time_limit}
                onChange={(e)=>set_time_limit(e.target.value)}></input>
                <h3>메모리 제한</h3>
                <input style={{width:'30vw'}} id="memory_limit" autoComplete="off" type="text" maxLength={30}
                placeholder="메모리 제한을 입력해주세요(MB 단위)." value={memory_limit}
                onChange={(e)=>set_memory_limit(e.target.value)}></input>
                <br></br>
                <button style={{float:'right'}} onClick={async ()=>{
                    try {
                        if (window.confirm('문제 수정 시 생성된 힌트가 삭제되며, 힌트를 다시 생성하셔야 합니다. 진행하시겠습니까?')){
                            const response = await problem_api.patch(`/problem/${id}`,
                                {title, problem_description, input_description, output_description, time_limit, memory_limit})
                            if (response.status == 200){
                                navigate(`/problem/${id}`)
                            }
                        }
                    } catch(error){
                        console.log(error.response.data.error)
                        console.log(error.message)
                    }
                }}>
                    저장
                </button>
            </div>
        </>
    )
}

export default ProblemModify