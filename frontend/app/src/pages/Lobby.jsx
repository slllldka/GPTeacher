import { useNavigate, useParams } from 'react-router-dom'
import Title from '../components/Title'
import { problem_api } from '../utils/axios_api'
import { useEffect, useState } from 'react'

function Lobby() {
    let { page } = useParams();

    let navigate = useNavigate()

    let [displays, set_displays] = useState(Array(10).fill('none'))
    let [titles, set_titles] = useState(Array(10).fill(''))
    let [ids, set_ids] = useState(Array(10).fill(0))
    
    let [cur_first_page, set_cur_first_page] = useState(0)
    let [max_page, set_max_page] = useState(0)

    useEffect(()=>{
        const fetchData = async() => {
            try {
                const response = await problem_api.get(`/problem/list/${page}`)
                console.log(response.data.problems.length)
                let copy_displays = [...displays]
                let copy_titles = [...titles]
                let copy_ids = [...ids]
                if (response.status == 200){
                    page = response.data.cur_page
                    set_cur_first_page((page-1) - (page-1) % 10 + 1)
                    set_max_page(response.data.max_page)
                    for(let i=0;i<response.data.problems.length;i++){
                        let problem = response.data.problems[i]
                        console.log(problem)
                        copy_displays[i] = 'block'
                        copy_titles[i] = problem['title']
                        copy_ids[i] = problem['id']
                    }
                    for(let i=response.data.problems.length;i<10;i++){
                        copy_displays[i] = 'none'
                    }
                    set_displays(copy_displays)
                    set_titles(copy_titles)
                    set_ids(copy_ids)
                }
                
            }catch(error){
                console.log(error.response.data.error)
                console.log(error.message)
            }
        }

        fetchData()
    }, [page])

    return(
        <>
            <Title></Title>
            <button style={{position:"relative", transform:"translate(400%, -200%)"}} onClick={()=>{
                navigate('/problem/generate')
            }}>
                문제 생성
            </button>
            <button style={{position:"relative", transform:"translate(420%, -200%)"}} onClick={()=>{
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                navigate('/')
            }}>
                로그아웃
            </button>
            <br></br>
            <h3>문제 목록</h3>
            <div style={{width:'500px', textAlign:'left'}}>
                <hr></hr>
                <div style={{display:displays[0], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[0]}`)
                }}>{titles[0]}</div>
                <hr style={{display:displays[0]}}></hr>
                <div style={{display:displays[1], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[1]}`)
                }}>{titles[1]}</div>
                <hr style={{display:displays[1]}}></hr>
                <div style={{display:displays[2], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[2]}`)
                }}>{titles[2]}</div>
                <hr style={{display:displays[2]}}></hr>
                <div style={{display:displays[3], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[3]}`)
                }}>{titles[3]}</div>
                <hr style={{display:displays[3]}}></hr>
                <div style={{display:displays[4], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[4]}`)
                }}>{titles[4]}</div>
                <hr style={{display:displays[4]}}></hr>
                <div style={{display:displays[5], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[5]}`)
                }}>{titles[5]}</div>
                <hr style={{display:displays[5]}}></hr>
                <div style={{display:displays[6], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[6]}`)
                }}>{titles[6]}</div>
                <hr style={{display:displays[6]}}></hr>
                <div style={{display:displays[7], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[7]}`)
                }}>{titles[7]}</div>
                <hr style={{display:displays[7]}}></hr>
                <div style={{display:displays[8], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[8]}`)
                }}>{titles[8]}</div>
                <hr style={{display:displays[8]}}></hr>
                <div style={{display:displays[9], cursor:'pointer'}} onClick={(e)=>{
                    e.preventDefault()
                    navigate(`/problem/${ids[9]}`)
                }}>{titles[9]}</div>
                <hr style={{display:displays[9]}}></hr>
            </div>
            <div>
                <span style={{marginLeft:'5px', marginRight:'5px', display:cur_first_page-10 >= 1 ? 'inline-block': 'none',
                    cursor:cur_first_page-10 >= 1 ? 'pointer' : 'auto'
                }} onClick={(e)=>{
                    e.preventDefault()
                    if(cur_first_page-10 >= 1){
                        navigate(`/lobby/${cur_first_page-10}`)
                    }
                }}>◀</span>
                {Array.from({length:10}, (_, i) => (
                    (cur_first_page + i <= max_page) && (
                        <span key={i} style={{marginLeft:'5px', marginRight:'5px', display:cur_first_page <= max_page ? 'inline-block' : 'none',
                            fontWeight:cur_first_page+i == page ? 'bold' : 'normal', cursor:cur_first_page+i == page ? 'auto' : 'pointer'}}
                            onClick={(e)=>{
                                e.preventDefault()
                                if(cur_first_page+i != page){
                                    navigate(`/lobby/${cur_first_page+i}`)
                                }
                            }}>
                            {cur_first_page+i}
                        </span>
                    )
                ))}
                <span style={{marginLeft:'5px', marginRight:'5px', display:cur_first_page+10 <= max_page  ? 'inline-block': 'none',
                    cursor:cur_first_page+10 <= max_page ? 'pointer' : 'auto'
                }} onClick={(e)=>{
                    e.preventDefault()
                    if(cur_first_page+10 <= max_page){
                        navigate(`/lobby/${cur_first_page+10}`)
                    }
                }}>▶</span>
            </div>
        </>
    )
}

export default Lobby