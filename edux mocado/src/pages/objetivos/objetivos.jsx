import React, {useState, useEffect} from "react";
import Menu from "../../components/menu/menu";
import Rodape from "../../components/rodape/rodape";
import Titulo from "../../components/titulo/index";
import jwt_decode from "jwt-decode";
import {Card, Button, Container, Row, Col} from "react-bootstrap";
import {url} from "../../utils/constants";

const Objetivos = () => {
    const token = localStorage.getItem("token-edux");
    const role = jwt_decode(token).role;
    const [turmas, setTurmas] = useState([]);

    useEffect(() => {
        fetch(`${url}/turma`)
        .then(response => response.json())
        .then(dados => {
            setTurmas(dados);
        })
        .catch(err => console.log(err));
    }, [])

    const renderizarTitulo = () => {
        if(role==="Professor") {
            return (
                <Titulo titulo="Objetivos" chamada="Gerencie os objetivos de seus alunos e os avalie"/>
            )
        }
        else {
            return (
                <Titulo titulo="Objetivos" chamada="Veja seus objetivos e o ranking por categoria de objetivos"/>
            )
        }
    }

    const mostrarErro = () => {
        if((turmas.length<1) && (role==="Professor")) {
            return (
                <Container style={{margin: "50px", textAlign: "center"}}>
                    <p>Desculpe! No momento você não está participando de nenhuma turma! <a href="/turmas">Clique aqui para criar uma!</a> </p>
                </Container>
            )
        }
        else if ((turmas.length<1) && (role==="Aluno")){
            return (
                <Container style={{margin: "50px", textAlign: "center"}}>
                    <p>Desculpe! No momento você não está participando de nenhuma turma! </p>
                </Container>
            )
        }
    }

    return (
        <div>
            <Menu/>
            {renderizarTitulo()}
            <Container>
                <Row style={{marginTop: "50px"}}>
                    {mostrarErro()}
                    {
                        turmas.map((turma, index) => {
                            return (
                                <Col key={index} xs={4}>
                                    <Card style={{margin: "25px"}}>
                                        <Card.Body>
                                            <Card.Title>{turma.descricao}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{turma.curso.titulo}</Card.Subtitle>
                                            <Card.Text>
                                                Esta turma tem {turma.professoresTurmas.length} professores e {turma.alunosTurmas.length} alunos.
                                            </Card.Text>
                                            <div style={{display: "flex", justifyContent: "center"}}>
                                                <Button variant="link" href={`/turma/objetivos/${turma.id}`}>Ver +</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
            <Rodape/>
        </div>
    )
}

export default Objetivos;