import { useParams } from "react-router-dom"
import Title from "../components/Title";
import { useEffect } from "react";

function ProblemView(){
    const { id } = useParams();
    
    return(
        <>
            <Title></Title>
            <div>
                {id}번 문제입니다.
            </div>
        </>
    )
}

export default ProblemView