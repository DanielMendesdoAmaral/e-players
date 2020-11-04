import React, {useState, useEffect} from "react";
import Menu from "../../components/menu/menu";
import Rodape from "../../components/rodape/rodape";
import {Form, Accordion, Card, Button, Col, Row, Tabs, Tab, Container, Table, Nav} from "react-bootstrap";
import jwt_decode from "jwt-decode";
import {url} from "../../utils/constants";

const ObjetivosTurma = () => {
    let idTurma = window.location.href.substr(38);
    const token = localStorage.getItem("token-edux");
    const role = jwt_decode(token).role;

    //objetivos
    const [idObj, setIdObj] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idCategoria, setIdCategoria] = useState("");
    
    //objAluno
    const [idObjAlu, setIdObjAlu] = useState("");
    const [idObjetivo, setIdObjetivo] = useState("");
    const [nota, setNota] = useState(0);
    const [dataAlcancado, setDataAlcancado] = useState("");

    const [objetivosAlunos, setObjetivosAlunos] = useState([])
    const [categorias, setCategorias] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [alunosEscolhidos, setAlunosEscolhidos] = useState([]);
    const [idCategoriaEscolhida, setIdCategoriaEscolhida] = useState("");
    const [objetivos, setObjetivos] = useState([]);

    useEffect(() => {
        listarCategorias();
        listarAlunos();
        listarObjetivosAlunos();
        listarObjetivos();
    }, []);

    const listarCategorias = () => {
        fetch(url + "/categoria")
        .then(response => response.json())
        .then(dados => {
            setCategorias(dados);
        })
        .catch(err => console.log(err))
    }

    const listarAlunos = () => {
        fetch(url + "/turma")
        .then(response => response.json())
        .then(dados => {
            let turma = dados.filter(dado => dado.id === idTurma);
            let listaAlunos = turma[0].alunosTurmas;
            setAlunos(listaAlunos);
        })
        .catch(err => console.log(err))
    }

    const removerAlunoEscolhido = (idAluno) => {
        fetch(url + "/turma")
        .then(response => response.json())
        .then(dados => {
            let turma = dados.filter(dado => dado.id === idTurma);
            let todosAlunosDaTurma = turma[0].alunosTurmas;
            let alunoEscolhido = todosAlunosDaTurma.filter(aluno => aluno.id === idAluno)[0]
            let indice;
            alunosEscolhidos.forEach(alunoRemover => {
                if(alunoRemover.id === alunoEscolhido.id) 
                    indice = alunosEscolhidos.indexOf(alunoRemover);
            })
            alunosEscolhidos.splice(indice,1);
            setAlunosEscolhidos([
                ...alunosEscolhidos
            ]);
        })
        .catch(err => console.log(err))
    }

    const escolherAluno = (idAluno) => {
        fetch(url + "/turma")
        .then(response => response.json())
        .then(dados => {
            let turma = dados.filter(dado => dado.id === idTurma);
            let todosAlunosDaTurma = turma[0].alunosTurmas;
            let alunoEscolhido = todosAlunosDaTurma.filter(aluno => aluno.id === idAluno)[0]
            setAlunosEscolhidos([
                ...alunosEscolhidos,
                alunoEscolhido
            ])
        })
        .catch(err => console.log(err))
    }

    const pegarOIdDoObjetivo = () => {
        fetch(url + "/objetivo")
        .then(response => response.json())
        .then(objetivos => {
            console.log(objetivos)
            let objetivo = objetivos.filter(objetivo => ((objetivo.descricao===descricao) && (objetivo.idCategoria===idCategoria)))
            setIdObjetivo(objetivo[0].id)
        })
        .catch(err => console.log(err))
    }

    const cadastrar = (event) => {
        event.preventDefault();

        //OBJETIVO

        let metodoObj = (idObj === "" ? "POST" : "PUT");
        let urlPostOuPutObj = (idObj === "" ? `${url}/objetivo` : `${url}/objetivo/${idObj}`);

        let objetivo = {
            descricao: descricao,
            idCategoria: idCategoria
        }

        fetch(urlPostOuPutObj, {
            method: metodoObj,
            body: JSON.stringify(objetivo),
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + token 
            } 
        })
        .catch(err => console.log(err));

        //OBJETIVO ALUNO

        let metodoObjAlu = (idObjAlu === "" ? "POST" : "PUT");
        let urlPostOuPutObjAlu = (idObjAlu === "" ? `${url}/objetivoaluno` : `${url}/objetivoaluno/${idObjAlu}`);

        pegarOIdDoObjetivo();

        alunosEscolhidos.forEach(alunoEscolhido => {
            
            let objetivoAluno = {
                nota: nota,
                dataAlcancado: dataAlcancado,
                idAlunoTurma: alunoEscolhido.id,
                idObjetivo: idObjetivo
            }

            fetch(urlPostOuPutObjAlu, {
                method: metodoObjAlu,
                body: JSON.stringify(objetivoAluno),
                headers: {
                    "content-type": "application/json",
                    "authorization": "Bearer " + token 
                } 
            })
            .catch(err => console.log(err));
        })
    }

    const renderizarCadastro = () => {
        if(role==="Professor") {
            return (
                <Accordion style={{width: "90vw", margin: "50px auto"}}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="primary" eventKey="0" style={{margin: "auto", display: "block"}}>Novo objetivo</Accordion.Toggle>
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
                                        <h2 style={{lineHeight: "300%", textAlign: "center"}}>Escolha alunos para atribuir este objetivo</h2>
                                        <Form.Control as="select" onChange={event => escolherAluno(event.target.value)} style={{marginBottom: "20px"}}>
                                            <option selected>Alunos</option>
                                            {
                                                alunos.map((aluno, index) => {
                                                    return (
                                                        <option key={index} value={aluno.id}>{aluno.usuario.nome}</option>
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
                                                                <Button onClick={event=>removerAlunoEscolhido(event.target.value)} style={{margin: "20px"}} key={index} value={aluno.id}>X {aluno.usuario.nome}</Button>
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

    const listarObjetivosAlunos = () => {
        fetch(`${url}/objetivoaluno`)
        .then(response => response.json())
        .then(dados => {
            setObjetivosAlunos(dados);
        })
        .catch(err => console.log(err));
    }

    const listarObjetivos = () => {
        fetch(`${url}/objetivo`)
        .then(response => response.json())
        .then(dados => {
            setObjetivos(dados);
        })
        .catch(err => console.log(err));
    }

    const deletar = (id) => {
        fetch(`${url}/objetivo/${id}`, {
            method: "DELETE"
        })
        .then(response=>response.json())
        .then(dados => {
            listarObjetivos();
            listarObjetivosAlunos();
        })
    }

    const renderizarObjetivosTurmas = (id) => {
        if(role==="Professor") {
            return (
                <div>
                    {
                        objetivos.filter(objetivo => objetivo.idCategoria === id).map((objetivo, index) => {
                            return (
                                <Accordion key={index}>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle eventKey="0" as={Button} variant="link" style={{display: "flex", margin: "auto", outline: "none"}}>
                                                {objetivo.descricao}
                                                <div>
                                                    <label htmlFor="alterar"><i className="fas fa-pencil-alt" style={{margin: "0 40px"}}></i></label>
                                                    <input type="button" id="alterar" value={objetivo.id} onClick={event => console.log(event.target.value)} style={{display: "none"}}></input>
                                                    <label htmlFor="deletar"><i class="fas fa-trash-alt"></i></label>
                                                    <input type="button" id="deletar" value={objetivo.id} onClick={event => deletar(event.target.value)} style={{display: "none"}}></input>
                                                </div>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        {
                                            objetivosAlunos.filter(objetivoAluno => objetivoAluno.idObjetivo === objetivo.id).map((objetivoAluno, index) => {
                                                return (
                                                    <Accordion.Collapse eventKey="0" key={index}>
                                                        <Card.Body>{objetivoAluno.alunoTurma.usuario.nome}</Card.Body>
                                                    </Accordion.Collapse>
                                                )
                                            })
                                        }
                                    </Card>
                                </Accordion>
                            )
                        })
                    }
                </div>
            )
        }
        else if(role==="Aluno") {
            return (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Userndsadadasdada             desenvolver               desenvolverame</th>
                        </tr>
                    </thead>
                </Table>
            )
        }
    }

    const renderizarMain = () => {
        if(role==="Professor") {
            return (
                <Container style={{marginBottom: "75px"}}>
                    <Tabs defaultActiveKey="gerenciar" id="uncontrolled-tab-example" style={{display: "flex", justifyContent: "center"}}>
                        <Tab eventKey="gerenciar" title="Gerenciar objetivos">
                            <Form.Group style={{width: "80%", margin: "50px auto"}}>
                                <p>Escolha uma categoria para filtrar os resultados: </p>
                                <Form.Control as="select" value={idCategoriaEscolhida} onChange={event => setIdCategoriaEscolhida(event.target.value)}>
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
                            {renderizarObjetivosTurmas(idCategoriaEscolhida)}
                        </Tab>
                    </Tabs>
                </Container>
            )
        }
        else {
            return (
                <Container style={{marginBottom: "75px"}}>
                    <Tabs defaultActiveKey="gerenciar" id="uncontrolled-tab-example" style={{display: "flex", justifyContent: "center"}}>
                        <Tab eventKey="gerenciar" title="Gerenciar objetivos">
                            
                        </Tab>
                    </Tabs>
                </Container>
            )
        }
    }

    return (
        <>
            <Menu/>
            {renderizarCadastro()}
            {renderizarMain()}
            <Rodape/>
        </>
    )
}

export default ObjetivosTurma;