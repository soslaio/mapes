
// Entry point da aplicação.
$(document).ready(function () {

    // $('.table').DataTable({
    //     language: {
    //         url: 'https://cdn.datatables.net/plug-ins/1.10.20/i18n/Portuguese-Brasil.json'
    //     }
    // });

    // Pendura no botão o método que filtra as consultas.
    $('#pesquisar').click(filtrarConsultas)

    // Carrega a lista de médicos.
    listarMedicos();
    filtrarConsultas();
});


function listarMedicos() {

    // Query padrão GraphQL que lista as informações dos médicos cadastrados.
    const query = `{
        todosMedicos {
            id
            nomeMedico
        }
    }`;

    // Executa a consulta de médicos na rota do GraphQL no servidor de API.
    consultar(query)

        // Passa a resposta da API para o método especialista em renderizar selects, informando
        // quais das informações retornadas correspondem ao valor e ao texto do select.
        .then(jsonResponse => renderizarSelect('#medicos', jsonResponse.data.todosMedicos, {
            valor: 'id',
            texto: 'nomeMedico'
        }));
}


function filtrarConsultas() {

    // Armazena a informação do médico selecionado.
    const codmedico = $('#medicos').val();
    const inicio = $('#inicio').val();
    const fim = $('#fim').val();

    // Consulta padrão GraphQL filtrando pelo código do médico selecionado.
    const query = `{
        consultas(
            idMedico: "${codmedico}",
            dataInicio: "${inicio}",
            dataFim: "${fim}" ) {
            medico {
                nomeMedico
            }
            numGuiaConsulta
            dataConsulta
            valorConsultaFormatado
            gastoConsultaFormatado
            qtdeExames
        }
    }`;

    // Executa a consulta de consultas na rota do GraphQL no servidor de API.
    consultar(query)
        .then(jsonResponse => {

            // Extrai o nome do médico do objeto com as informações do mesmo
            // e substitui esse objeto pelo nome extraído.
            const dadosAjustados = jsonResponse.data.consultas.map(dado => {
                return {
                    ...dado,
                    medico: dado.medico.nomeMedico,
                    dataConsulta: dataISOParaLocal(dado.dataConsulta)
                }
            });

            // Passa os dados ajustados pro método especialista em renderizar tabelas.
            renderizarTabela('#consultas', dadosAjustados);

            // Passa os dados pro próximo then.
            return jsonResponse.data.consultas;
        })
        .then(renderizarGrafico)
}

function tratarDados(dados) {

    // Conta as ocorrências de mês/ano nas datas das consultas.
    var contagemOcorrencias = dados.reduce((contador, dado) => {
        const mesAnoConsulta = tratarData(dado.dataConsulta);
        contador.hasOwnProperty(mesAnoConsulta) ? contador[mesAnoConsulta]++ : contador[mesAnoConsulta] = 1;
        return contador;
    }, {});

    // Transforma o contador num objeto que pode ser trabalhado pelo D3.
    return Object.keys(contagemOcorrencias).map(key => {
        return {
            mesAno: key,
            quantidadeConsultas: contagemOcorrencias[key]
        }
    })
}

function renderizarGrafico(dados) {

    const data = tratarDados(dados);

    // Limpa todos os elementos g do DOM.
    d3.selectAll("g > *").remove();

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };
    var svg = d3.select("svg");
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(function (d) {
            return d.mesAno;
        }));

    var y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, function (d) {
            return Number(d.quantidadeConsultas);
        })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-4em")
        .attr("text-anchor", "end")
        .text("Número de Consultas");

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.mesAno);
        })
        .attr("y", function (d) {
            return y(Number(d.quantidadeConsultas));
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(Number(d.quantidadeConsultas));
        });
}

function tratarData(dataISO) {
    const dataObj = new Date(`${dataISO}T00:00:00`);
    return dataObj.toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric' });
}

function dataISOParaLocal(data) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}