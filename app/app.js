
// Entry point da aplicação.
$(document).ready(function () {

    // Pendura no botão o método que filtra as consultas.
    $('#pesquisar').click(filtrarConsultas)

    // Carrega a lista de médicos.
    listarMedicos();
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

    // Consulta padrão GraphQL filtrando pelo código do médico selecionado.
    const query = `{
        consultas(idMedico: "${codmedico}") {
            medico {
                nomeMedico
            }
            numGuiaConsulta
            dataConsultaFormatada
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
                    medico: dado.medico.nomeMedico
                }
            });

            // Passa os dados ajustados pro método especialista em renderizar tabelas.
            renderizarTabela('#consultas', dadosAjustados);
        })
}
