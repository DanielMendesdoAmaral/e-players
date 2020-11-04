import React, {useState, useEffect} from 'react';
import Menu from "../../components/menu/menu";
import Rodape from "../../components/rodape/rodape";
import {Tab, Tabs, Form, Button, Container, FormFile} from 'react-bootstrap';
import {url} from "../../utils/constants";
 
const TimeLine = () => {
    const [turmas, setTurmas] = useState([]);

    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        fetch(`${url}/turma`)
        .then(response => response.json())
        .then(dados => {
            setTurmas(dados);
        })
        .catch(err => console.log(err));
    }, [])

    const upload = (event) => {
        event.preventDefault();

        let formData = new FormData();
        formData.append("arquivo", event.target.files[0]);
        setImagem(formData); 
    }

    const salvar = (event) => {
        event.preventDefault();

        let dica = {
            descricao: descricao,
            urlImagem: imagem,
            idUsuario: ""
        }

        /*let metodo = (id === 0 ? "POST" : "PUT");
        let urlPostOuPut = (id === 0 ? `${url}/categorias` : `${url}/categorias/${id}`);
    
        fetch(urlPostOuPut, {
            method: metodo,
            body: JSON.stringify(categoria),
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token-nyous") //Em endpoints que precisam de autorização na api, precisamos inserir no cabeçalho essa autorization e passar o token. NÃO SE ESQUEÇA DE COLOCAR O ESPAÇO APÓS O BEARER.
            } 
        })
        .then(response => response.json())
        .then(response => {
            if(metodo==="POST")
                alert("Categoria cadastrada com sucesso.");
            else 
                alert("Categoria editada com sucesso.");
            listar();
        })
        .catch(err => alert(err + ". Mande um email para a nossa equipe de suporte: event.suport@gmail.com"));*/
    }

    return(
        <div>
            <Menu/>

            <Container style={{margin: "50px auto"}}>
                <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" style={{display: "flex", justifyContent: "center"}}>
                    {
                        turmas.map((turma, index) => {
                            return (
                                <Tab eventKey={`${index}`} key={index} title={turma.descricao} >
                                    <Form style={{marginTop : '35px', width: "90vw", display: "flex", justifyContent: ""}} onSubmit={event=>salvar(event)}>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Control style={{border : '2px solid #00c2ee', borderRadius : '15px', width: "50vw", height: "90px"}} as="textarea" placeholder="O que você está pensando" rows={3} value={descricao} onChange={event=>setDescricao(event.target.value)}/>
                                        </Form.Group>
                                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "20px"}}>
                                            <FormFile>
                                                <FormFile.Label htmlFor="arquivo"><i class="fas fa-paperclip" style={{color: "#00C2EE", fontSize: "30px"}}></i></FormFile.Label>
                                                <FormFile.Input id="arquivo" isInvalid style={{display: "none"}} onChange={event=>upload(event)}/>
                                            </FormFile>
                                            <Button style={{border : '2px solid #00c2ee', borderRadius : '15px', color : '#00c2ee', height: "50px"}}  variant="ligth" type="submit">Enviar</Button>
                                        </div>
                                    </Form>
                                </Tab>
                            )
                        })
                    }
                </Tabs>
            </Container>   
            <Rodape/>
        </div>
    )
}

export default TimeLine;