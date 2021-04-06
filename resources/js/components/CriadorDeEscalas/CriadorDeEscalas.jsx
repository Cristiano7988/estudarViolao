import { Box, Button, ButtonGroup, Card, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, Typography } from '@material-ui/core';
import React, { Component, Fragment } from 'react';
import Escalas from "../../dados/Escalas";
import Intervalos from '../../dados/Intervalos';
import Braco from '../Braco';

class CriadorDeEscalas extends Component {
    constructor() {
        super()
        this.escala = new Escalas();
        this.intervalos = new Intervalos();
        this.nova_escala = null;
        this.handleChange = this.handleChange.bind(this);
        this.toggleEstado = this.toggleEstado.bind(this);
        this.state = {
            tom: null,
            menor: false,
            complemento: false,
            cromatica: false,
            estender: false,
            afinar: false,
            escala: null,
            intervalos: []
        }
    }

    toggleEstado(e) {
        const { name } = e.target;
        let novoEstado = {...this.state};
        let {tom, menor, complemento, cromatica} = this.state;
        let tipo = cromatica ? 0 : 1;
        
        e.target.classList.toggle(name);
        novoEstado[name] = e.target.classList.contains(name);
        novoEstado['complemento'] = complemento;

        if(name == 'cromatica') {
            tipo = cromatica ? 1 : 0;

            novoEstado = {
                ...novoEstado,
                menor: false,
                complemento: false,
                tom: tom.replace('m', ''),
            };
        }
        
        if(name == 'menor') {
            tom = menor
                ? tom.replace('m', '')
                : tom + 'm';
            
            complemento = tom.match(/m/) ? 'Natural' : false;

            novoEstado = {
                ...novoEstado,
                tom,
                menor: !menor,
                complemento
            }
        }

        let escala = this.escala.formarEscala(tom, tipo, complemento).notas
        novoEstado['escala'] = escala

        novoEstado['intervalos'] = escala.map( (nota, indice)=> (
            this.intervalos.classifica([nota, escala[(indice + 1) % escala.length]])
        ));

        this.setState(novoEstado);
    }

    toggleAcidente(acidente) {
        let { tom, menor, complemento, escala, cromatica, intervalos } = this.state;
        const regex = new RegExp(acidente);
        const acidenteSalvo = [...tom][1];
        const tipo = cromatica ? 0 : 1
        const adicionaComplemento = menor
            ? acidente + 'm'
            : acidente;

        if(acidenteSalvo != acidente) tom = [...tom][0];
        
        tom = tom.match(regex)
            ? tom.replace(acidente, '')
            : tom.replace('m', '') + adicionaComplemento;
        
        escala = this.escala.formarEscala(tom, tipo, complemento).notas;
        intervalos = escala.map( (nota, indice)=> ( // Não faz diferença
            this.intervalos.classifica([nota, escala[(indice + 1) % escala.length]])
        ));
        
        this.setState({ tom, escala, intervalos });
    }

    handleChange(e) {
        const {name, value} = e.target;
        const novoEstado = {...this.state}
        novoEstado[name] = value;

        if(name == 'tom') {
            const tipo = novoEstado['cromatica'] ? 0 : 1
            novoEstado['menor'] = value.match(/m/);
            novoEstado['complemento'] = false;


            let escala = this.escala.formarEscala(value, tipo, novoEstado['complemento']).notas
            novoEstado['escala'] = escala

            novoEstado['intervalos'] = escala.map( (nota, indice)=> (
                this.intervalos.classifica([nota, escala[(indice + 1) % escala.length]])
            ));
        }

        this.setState(novoEstado);
    }

    limpaHighlight() {
        let casas = Array.prototype.slice.call(document.querySelectorAll('[data-nota]'));
        casas.map(casa=>casa.classList.remove('highlight'));
    }

    highlight(nota) {
        this.limpaHighlight();
        let casas = Array.prototype.slice.call(document.querySelectorAll('[data-nota]'));
        
        casas.find(casa=>{
            let homonimos = new RegExp(`\\[${nota}\\]`)

            if(casa.dataset.nota.match(homonimos)) {
                casa.classList.add('highlight')
            }
        })
    }

    render() {
        const {
            tom,
            menor,
            cromatica,
            complemento,
            escala,
            intervalos,
            afinar,
            estender
        } = this.state;

        const notas = [...this.escala.diatonica.notas, {cifra: tom ? tom : ''}];
        let titulo = 'Escala ';
        let adicionaComplemento = menor ? 'menor ' : 'Maior ';
        
        adicionaComplemento += complemento ? complemento : '';
        titulo += cromatica ? 'Cromática' : adicionaComplemento;

        return ( 
            <Container maxWidth="sm" align="center" className="criador-de-escalas">
                <Card className="folder">
                    {tom ?
                        <Typography
                            variant="h4"
                            component="h1"
                            children={titulo}
                        />
                    : ""}

                    {!this.state.escala ?
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            component="span"
                            gutterBottom
                            children="Insira um tom para visualizar sua escala"
                        />
                    :''}

                    <Grid container spacing={1} alignContent="center" justify="center" direction="row">
                        <Grid item className="campo-tom">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Tom</InputLabel>
                                <Select
                                    name="tom"
                                    value={tom ? tom : ""}
                                    onChange={this.handleChange}
                                    label="Tom"
                                    children={listaDeNotas(notas)}
                                />
                            </FormControl>
                        </Grid>

                        {tom ? <>
                            <Grid item className="container-acidentes">
                                <ButtonGroup
                                    size="small"
                                    orientation="vertical"
                                    color="default"
                                    aria-label="vertical outlined primary button group"
                                >
                                    <Button
                                        name="bemol"
                                        children="&#9837;"
                                        onClick={()=>this.toggleAcidente('b')}
                                    />
                                    <Button
                                        name="sustenido"
                                        children="&#9839;"
                                        onClick={()=>this.toggleAcidente('#')}
                                    />
                                </ButtonGroup>
                            </Grid>

                            {!cromatica ?
                                SwitchComponent(this, 'Maior', 'menor', menor)
                            : ''}
                            
                            {SwitchComponent(this, 'Diatônica', 'Cromática', cromatica)}
                        </> : ""}

                        {menor ?
                            <Grid container justify="center">
                                <RadioGroup
                                    row
                                    defaultValue="Natural"
                                    children={listaDeComplementos(this)}
                                />
                            </Grid>
                        : ""}
                    </Grid>

                    {escala && !cromatica ? <>
                        <Braco
                            escala={escala}
                            afinar={afinar}
                            estender={estender}
                        />
                        <Container>
                            <div className="container-btn">
                                <input
                                    type="button"
                                    name="estender"
                                    title="Mudar tamanho do braço"
                                    className="btn-editor arm"
                                    onClick={this.toggleEstado}
                                />
                                <input
                                    type="button"
                                    name="afinar"
                                    title="Habilitar Afinação"
                                    className="btn-editor hand"
                                    onClick={this.toggleEstado}
                                />
                            </div>
                        </Container>
                    </> : ''}

                    {escala ?
                        <Container>
                            <Card className="container-intervalos">
                                <Grid container direction="row" justify="space-around" className="notas">
                                    {escala.map( (nota, index) => (
                                        <Grid item key={index}>
                                            <Typography
                                                variant="body2"
                                                onMouseOver={()=>this.highlight(nota.cifra)}
                                                onMouseLeave={()=>this.limpaHighlight()}
                                                children={nota.cifra}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                {!cromatica ?
                                    <Grid container direction="row" justify="space-around"  className="valores">
                                        {escala.map( (nota, index) => (
                                            <Grid item key={index}>
                                                <Typography
                                                    variant="body2"
                                                    title={intervalos[index].nome}
                                                    children={intervalos[index].valor}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                : ''}
                            </Card>
                        </Container>
                    : ''}
                </Card>
            </Container>
         );

        function SwitchComponent(contexto, defaultValue, newValue, estado) {
            const name = newValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]|[^a-z]/g, "");
            return (
                <Grid component="label" container justify="center" alignItems="center" spacing={1}>
                    <Grid item>{defaultValue}</Grid>
                    <Grid item>
                        <Switch
                            color="primary"
                            onChange={contexto.toggleEstado}
                            checked={estado ? estado : false}
                            name={name}
                        />
                    </Grid>
                    <Grid item>{newValue}</Grid>
                </Grid>
            );
        }

        function listaDeComplementos(contexto) {
            const complementos = ["Natural", "Harmônica","Melódica"];
            return (
                complementos.map((complemento, index) => (
                    <Fragment key={index}>
                        <FormControlLabel
                            value={complemento}
                            control={<Radio size="small" color="primary" />}
                            label={<Box fontSize={14} fontFamily="Nunito" children={complemento}/>}
                            onChange={(e)=>{
                                e.preventDefault();

                                const escala = contexto.escala.formarEscala(contexto.state.tom, 1, complemento).notas;

                                const intervalos = escala.map( (nota, indice)=> (
                                    contexto.intervalos.classifica([nota, escala[(indice + 1) % escala.length]])
                                ));

                                contexto.setState({
                                    complemento: complemento,
                                    escala,
                                    intervalos
                                })
                            }}
                        />
                    </Fragment>
                ))
            );
        }

        function listaDeNotas(notas) {
            return (
                notas.map((nota, index)=> (
                    <MenuItem
                        key={index}
                        value={nota.cifra}
                        children={nota.cifra}
                    />
                ))
            );
        }
    }
}
 
export default CriadorDeEscalas;