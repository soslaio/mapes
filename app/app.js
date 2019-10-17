
$(document).ready(function () {
    $('#medicos').select2();
    $('#pesquisar').click(filtrarConsultas)

    listarMedicos();
});

function consultar(query) {
    const url = `http://localhost:8001/graphql/`;
    var config = {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            query: query
        })
    };
    return fetch(url, config)
        .then(response => response.json())
}

function listarMedicos() {
    const query = `{
        todosMedicos {
            id
            nomeMedico
        }
    }`;

    return consultar(query)
        .then(jsonResponse => {
            jsonResponse.data.todosMedicos.forEach(consulta => {
                var objConsulta = new Option(consulta.nomeMedico, consulta.id, false, false);
                $('#medicos').append(objConsulta).trigger('change');
            })
        })
}

function filtrarConsultas() {
    const codmedico = $('#medicos').val();
    const query = `{
        consultas(idMedico: "${codmedico}") {
            medico {
                nomeMedico
            }
            numGuiaConsulta
            dataConsulta
            valorConsulta
            gastoConsulta
            qtdeExames
        }
    }`;

    consultar(query)
        .then(jsonResponse => {
            return jsonResponse.data.consultas.reduce((html, consulta) => html += `
                    <tr>
                        <td>${consulta.medico.nomeMedico}</td>
                        <td>${consulta.numGuiaConsulta}</td>
                        <td>${consulta.dataConsulta}</td>
                        <td>${consulta.valorConsulta}</td>
                        <td>${consulta.gastoConsulta}</td>
                        <td>${consulta.qtdeExames}</td>
                    </tr>
                `, '')
        })
        .then(html => {
            document.querySelector('#consultas').innerHTML = html;
        })
}
