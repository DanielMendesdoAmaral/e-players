import React, {useState, useEffect} from "react";
import Menu from "../../components/menu/menu";
import Rodape from "../../components/rodape/rodape";
import {Form, Accordion, Card, Button, Col, Row} from "react-bootstrap";
import jwt_decode from "jwt-decode";

const ObjetivosTurma = () => {
    let id = window.location.href.substr(38);
    const token = localStorage.getItem("token-edux");
    const role = jwt_decode(token).role;

    //objetivos
    const [descricao, setDescricao] = useState("");
    const [idCategoria, setIdCategoria] = useState("");

    const renderizarCadastro = () => {
        if(role==="Professor") {
            return (
                <Accordion style={{width: "90vw", margin: "auto"}}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="primary" eventKey="0" style={{margin: "auto", display: "block"}}>Nova turma</Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Form onSubmit={event => cadastrar(event)}>
                                    <Form.Group>
                                        <h2 style={{lineHeight: "300%", textAlign: "center"}}>Configurações gerais</h2>
                                        <Form.Control as="textarea" rows={3} placeholder="Descreva o objetivo" value={descricao} onChange={event=>setDescricao(event.target.value)}/>
                                        <Form.Control as="select" value={idCategoria} onChange={event => setIdCategoria(event.target.value)}>
                                            <option value={0} selected>Categoria</option>
                                            {
                                                categorias.map((categoria, index) => {
                                                    return (
                                                        <option key={index} value={categoria.id}>{categoria.tipo}</option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <h2 style={{lineHeight: "300%", textAlign: "center"}}>Escolha os integrantes da turma</h2>
                                        <Form.Label style={{fontWeight: "bolder"}}>Os alunos:</Form.Label>
                                        <Form.Control as="select" onChange={event => escolherAluno(event.target.value)} style={{marginBottom: "20px"}}>
                                            <option selected>Alunos</option>
                                            {
                                                alunos.map((aluno, index) => {
                                                    return (
                                                        <option key={index} value={aluno.id}>{aluno.nome}</option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                        <div style={{height: "auto", borderRadius: "25px", borderTop: "solid 1.5px #00d65f", borderRight: "solid 1.5px #ff271c", borderBottom: "solid 1.5px #f9e800", borderLeft: "solid 1.5px #00c2ee"}}>
                                            <Row>
                                                {
                                                    alunosEscolhidos.map((aluno, index) => {
                                                        return (
                                                            <Col xs="2" key={index}>
                                                                <Button onClick={event=>removerAlunoEscolhido(event.target.value)} style={{margin: "20px"}} key={index} value={aluno.id}>X {aluno.nome}</Button>
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </Row>
                                        </div>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" style={{margin: "auto", display:"block", width: "100px"}}>Cadastrar</Button>
                                </Form>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )
        }
    }

    return (
        <>
            <Menu/>
            <Rodape/>
        </>
    )
}

export default ObjetivosTurma;