import { useNavigate, useParams } from "react-router-dom"
import Title from "../components/Title";
import { useEffect, useRef, useState } from "react";
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
    let [hints, set_hints] = useState([])
    let [mouseovered_key_text, set_mouseovered_key_text] = useState('')

    let [hint_generate_button_active, set_hint_generate_button_active] = useState(true)

    let spanRefs = useRef([])
    let [hint_top, set_hint_top] = useState('')
    let [hint_xcenter, set_hint_xcenter] = useState('')

    useEffect(()=>{
        const fetchData = async() => {
            set_hints([])

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

    // 특정 단어나 문장을 빨간색으로 변경하는 함수
    const highlightText = (text) => {
        let result = []
        let lastIndex = 0

        let key_texts = hints.map(e => e.key_text)
        let i = 0

        key_texts.forEach((key_text) => {
            let index = text.indexOf(key_text, lastIndex)
            if (index !== -1) {
                result.push(text.substring(lastIndex, index)) // 기존 검정색 텍스트
                result.push(
                    <>
                        <span
                            key={index}
                            ref={e=>spanRefs.current[index] = e}
                            style={{
                                display: "inline-block", // 텍스트를 감싸는 블록처럼 처리
                                cursor: "pointer",
                                border: "2px solid red",
                                padding: "2px 4px",
                                margin: "2px 2px",
                                whiteSpace: "pre-wrap", // 줄바꿈을 따르게 함
                                wordWrap: "break-word", // 긴 단어가 잘리지 않게 함

                            }}
                            onMouseOver={()=>{
                                set_mouseovered_key_text(key_text)
                                let rect = spanRefs.current[index].getBoundingClientRect()
                                set_hint_top(rect.top + window.scrollY)
                                set_hint_xcenter(rect.left + window.scrollX + rect.width / 2)
                            }}
                            onMouseOut={()=>set_mouseovered_key_text('')}
                        >
                            {key_text}
                        </span>
                        {key_text === mouseovered_key_text && (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: `${window.innerHeight - (hint_top - 9)}px`,  //박스를 텍스트 위쪽에 위치
                                    left: `${hint_xcenter}px`,
                                    maxWidth: "300px",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "white",
                                    border: "2px solid green",
                                    padding: "5px",
                                    zIndex: 1000,
                                    wordWrap: 'break-word',
                                    whiteSpace: "whitespace",
                                }}
                            >
                                {hints[i].description}
                                <span
                                    style={{
                                        content: "",
                                        position: "absolute",
                                        bottom: "-10px",  // 삼각형 위치 조정
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: 0,
                                        height: 0,
                                        borderLeft: "10px solid transparent",
                                        borderRight: "10px solid transparent",
                                        borderTop: "10px solid green", // 삼각형 색상
                                    }}
                                ></span>
                            </span>
                            
                        )}
                    </>
                )
                lastIndex = index + key_text.length
            }
            i++
        })

        result.push(text.substring(lastIndex)) // 마지막 남은 텍스트 추가
        return result
    };


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
            <button style={{position:"relative", transform:"translate(400%, -150%)"}}
                disabled={!hint_generate_button_active}
                onClick={async ()=>{
                    set_hint_generate_button_active(false)
                    try{
                        const response = await problem_api.post(`hint/${id}`, {id})
                        if (response.status == 201){
                            window.alert('힌트 생성에 성공하였습니다.')
                        }
                    }catch(error){
                        if (error.response.status == 409){
                            window.alert('생성된 힌트가 존재합니다. 힌트 보기 버튼을 사용해주세요.')
                        }else{
                            window.alert('힌트 생성에 실패했습니다. 다시 시도해주세요')
                        }
                        console.log(error.response.data.error)
                        console.log(error.message)
                    }
                    set_hint_generate_button_active(true)
            }}>
                힌트 생성
            </button>
            <button style={{position:"relative", transform:"translate(400%, -150%)"}} onClick={async ()=>{
                if(hints.length == 0){
                    try{
                        const response = await problem_api.get(`hint/${id}`)
                        if (response.status == 200){
                            set_hints(response.data.hints)
                            console.log(response.status)
                        }
                    }catch(error){
                        if (error.response.status == 404){
                            window.alert('힌트 생성 버튼을 통해 힌트를 먼저 생성해주세요.')
                        }
                        console.log(error.response.data.error)
                        console.log(error.message)
                    }
                }
            }}>
                힌트 보기
            </button>
            <br></br>
            <div style={{width:'500px', textAlign:'left'}}>
                <h2>제목</h2>
                <div>
                    {highlightText(title)}
                </div>
                <hr style={{marginBottom:'50px'}}></hr>
                <h2>문제 설명</h2>
                <div>
                    {highlightText(problem_description)}
                </div>
                <hr style={{marginBottom:'50px'}}></hr>
                <h2>입력 조건</h2>
                <div>
                    {highlightText(input_description)}
                </div>
                <hr style={{marginBottom:'50px'}}></hr>
                <h2>출력 조건</h2>
                <div>
                    {highlightText(output_description)}
                </div>
                <hr style={{marginBottom:'50px'}}></hr>
                <h2>시간 제한</h2>
                <div>
                    {highlightText(time_limit)}
                </div>
                <hr style={{marginBottom:'50px'}}></hr>
                <h2>메모리 제한</h2>
                <div>
                    {highlightText(memory_limit)}
                </div>
                <hr style={{marginBottom:'50px'}}></hr>
                <div style={{display: hints.length > 0 ? 'block' : 'none', color:'green'}}>
                    <h2>최종 힌트</h2>
                    <div>
                        {hints.length > 0 ? hints[0].description : ''}
                    </div>
                    <hr style={{marginBottom:'50px'}}></hr>
                </div>
            </div>
        </>
    )
}

export default ProblemView