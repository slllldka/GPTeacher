import { useNavigate } from "react-router-dom"

function Title(){
    let navigate = useNavigate()
    return(
        <>
            <h1 style={{cursor: 'pointer'}} onClick={(e)=>{
                e.preventDefault()
                navigate('/')
            }}>GPTeacher</h1>
        </>
    )
}

export default Title