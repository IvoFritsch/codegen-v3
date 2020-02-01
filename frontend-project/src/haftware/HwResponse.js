/*
 * Classe que representa a estrutura das respostas do servidor REST da Haftware no front-end.
 * Instanciar essa classe passando o JSON inteiro recebido do servidor
 *
 */
export default class HwResponse {

  // Constroi um objeto HwResponse com base no conteúdo String da resposta
 constructor(response) {
      this.response = response;
      this.camposInvalidos = null;
  }

    //OK, ERRO_VALIDACAO, REQUEST_INVALIDO, RECUSADO, ERRO_INTERNO;
  // Retorna se a resposta foi OK
   isOk = () => {
      return this.response.status === 'OK';
  };

  // Retorna se o request teve algum erro de validação
  isErroValidacao = () => {
    return this.response.status === 'ERRO_VALIDACAO';
  };

  // Retorna se houve algum erro no request, como url invalida ou algo do tipo
  isErroRequest = () => {
    return this.response.status === 'REQUEST_INVALIDO';
  };

  // Retorna se o request foi recusado
   isRecusado = () => {
      return this.response.status === 'RECUSADO';
  };

  // Retorna se houve um erro interno no servidor
   isErroInterno = () => {
      return this.response.status === 'ERRO_INTERNO';
  };

  // Retorna o erro de request recusado
  getErroRecusado = () => {
    if (this.isOk())
    return false;
    var length = this.response.erros.length;
    for (var i = 0; i < length; i++) {
      if (this.response.erros[i].tipo === 'RECUSADO')
      return this.response.erros[i];
    }
    return false;
  };

  // Retorna se tem algum erro de autenticação
   hasErroAuth = () => {
      if (this.isOk())
          return false;
      var length = this.response.erros.length;
      for (var i = 0; i < length; i++) {
          if (this.response.erros[i].tipo === 'AUTH')
              return true;
      }
      return false;
  };

  // Retorna o erro de autenticação
   getErroAuth = () => {
      if (this.isOk())
          return false;
      var length = this.response.erros.length;
      for (var i = 0; i < length; i++) {
          if (this.response.erros[i].tipo === 'AUTH')
              return this.response.erros[i];
      }
      return false;
  };

  // Retorna se tem algum erro de request inválido (tipo REQUEST)
   hasErroRequest = () => {
      if (this.isOk())
          return false;
      var length = this.response.erros.length;
      for (var i = 0; i < length; i++) {
          if (this.response.erros[i].tipo === 'REQUEST')
              return true;
      }
      return false;
  };

  // Retorna o erro de request inválido
   getErroRequest = () => {
      if (this.isOk())
          return false;
      var length = this.response.erros.length;
      for (var i = 0; i < length; i++) {
          if (this.response.erros[i].tipo === 'REQUEST')
              return this.response.erros[i];
      }
      return false;
  };

  // Retorna se tem algum erro validacão nos campos (tipo CAMPOS_INVALIDOS)
   hasErroCamposInvalidos = () => {
      if (this.isOk())
          return false;
      var length = this.response.erros.length;
      for (var i = 0; i < length; i++) {
          if (this.response.erros[i].tipo === 'CAMPOS_INVALIDOS')
              return true;
      }
      return false;
  };

  // Retorna um array de strings contendo o nome dos campos que estão inválidos
   getCamposInvalidos = () => {
      if (this.camposInvalidos !== null)
          return this.camposInvalidos;
      var obj = this.getObjCamposInvalidos();
      if (obj === null)
          return [];
      var retorno = [];
      for (var property in obj.campos) {
          if (obj.campos.hasOwnProperty(property)) {
              retorno.push(property);
          }
      }
      this.camposInvalidos = retorno;
      return retorno;
  };

  //Retorna true ou false se tiver erro no campo
   hasErroNoCampo = (nomeCampo) => {
      return this.getCamposInvalidos().includes(nomeCampo);
  };

  // Retorna se tem alguma mensagem de alerta
   hasMensagemAlerta = () => {
      if(typeof this.response.mensagemAlerta === "undefined") return false;
      return true;
  };

  // Retorna a mensagem de alerta
   getMensagemAlerta = () => {
      if(!this.hasMensagemAlerta()) return null;
      return this.response.mensagemAlerta;
  };

  // Retorna se tem algum redirect
   hasRedirect = () => {
      if(typeof this.response.redirectTo === "undefined") return false;
      return true;
  };

  // Retorna a URL do redirect
   getRedirect = () => {
      if(!this.hasRedirect()) return null;
      return this.response.redirectTo;
  };

  // Retorna o objeto que representa o erro no campo passado, null se não existir erro nesse campo.
  //    Esse objeto tem a seguinte estrutura:
  /*
   {
   codigo:"", // Um palavra que representa o tipo do erro, pode ser basicamente: NAO_INFORMADO, VALOR_INVALIDO, MIN_SIZE_INVALIDO, MAX_SIZE_INVALIDO
   mensagem:"" // A mensagem de erro gerada pelo servidor back-end para esse erro, essa mensagem já é sanitizada e pode ser diretamente exibida para o usuário
   }
   */
   getErroCampo = (nomeCampo) => {
      if (!this.getCamposInvalidos().includes(nomeCampo))
          return null;
      var obj = this.getObjCamposInvalidos();
      return obj.campos[nomeCampo];
  };

  // Retorna o status da resposta em formato String, dar preferencia ao uso da funcao isOk para testar se foi OK
   getStatus = () => {
      return this.response.status;
  };

  // Retorna o conteudo da resposta, ja parseado como um objeto
   getConteudo = () => {
      if (this.response.conteudo === null || this.response.conteudo === "")
          return {};
      return this.response.conteudo;
  };



  // -------------------------------------------------------------------------------------------------------
  // -------------------- Funções privadas, evitar utilizar ------------------------------------------------

  // Retorna o objeto Erro que corresponde aos campos inválidos, função interna, não usar externamente
   getObjCamposInvalidos = () => {
      if (!this.hasErroCamposInvalidos())
          return null;
      var length = this.response.erros.length;
      for (var i = 0; i < length; i++) {
          if (this.response.erros[i].tipo === 'CAMPOS_INVALIDOS')
              return this.response.erros[i];
      }
  };

}
