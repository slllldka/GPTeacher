import { useParams } from "react-router-dom"
import Title from "../components/Title";

function ProblemView(){
    const { id } = useParams();
    
    return(
        <>
            <Title></Title>
            <div className="card">
                <span>{id}번 문제입니다.</span>
            </div>
        </>
    )
}

export default ProblemView