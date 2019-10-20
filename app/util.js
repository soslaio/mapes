
/**
 * Função especialista em efetuar querys remotas no servidor de API GraphQL.
 * 
 * @param {string} query Query padrão GraphQL para ser executada no servidor de API.
 */
async function consultar(query) {

    // URL base para todas as consultas ao GraphQL.
    const url = `https://mapes.herokuapp.com/graphql/`;

    // Configurações da requisição, incluindo método de consulta,
    // cabeçalho HTML e dados JSON da consulta.
    var requestConfig = {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            query: query
        })
    };

    // Retorna uma promisse que passa por um processo de análise da resposta
    // e de exibição de erro, caso algo errado aconteça.
    return fetch(url, requestConfig)
        .then(analisarRespostaHTTP)
        .then(response => response.json())
        .catch(exibirErro);
}


/**
 * Função especialista em renderizar dados num select HTML.
 * 
 * @param {string} seletor Seletor CSS do elemento select onde os dados devem ser renderizados.
 * @param {Array} dados    Array de objetos com as informações a serem renderizadas.
 * @param {object} mapa    Objeto que relaciona a propriedade do objeto e o valor e texto exibido pelo select.
 */
function renderizarSelect(seletor, dados, mapa) {

    dados.forEach(dado => {

        // Cria o elemento option e adiciona ao select.
        var objConsulta = new Option(dado[mapa.texto], dado[mapa.valor], false, false);

        $(seletor).append(objConsulta);
    });
}


/**
 * Função especialista em renderizar dados no corpo de tabelas HTML.
 * 
 * @param {string} seletor Seletor CSS do elemento tbody onde os dados devem ser renderizados.
 * @param {Array} dados    Dados plano a serem renderizados na tabela.
 */
function renderizarTabela(seletor, dados) {

    const htmlBody = dados.reduce((htmlLinha, dado) => {
        return htmlLinha += `<tr>
            ${Object.keys(dado).reduce((htmlColuna, coluna) => htmlColuna += `<td>${dado[coluna]}</td>`, '')}
        </tr>`;
    }, '');

    $(seletor).html(htmlBody);
}


/**
 * Função que exibe em tela uma exceção lançada.
 * 
 * @param {Error} erro Exceção lançada pelo sistema.
 */
function exibirErro(erro) {

    alert(`Falha ao consultar: ${erro.message}.`);
}


/**
 * Função que analisa uma resposta HTTP a procura de erros.
 * 
 * @param {object} resposta Object de resposta HTTP da fetch API.
 */
async function analisarRespostaHTTP(resposta) {

    // Se a resposta estiver OK, retorna a resposta.
    if (resposta.ok) {
        return resposta;
    }

    // Lança uma exceção caso a resposta não esteja OK.
    throw new Error(resposta.statusText);
}
