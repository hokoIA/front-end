import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Função assíncrona para buscar os dados da API Flask
    async function fetchUsuarios() {
      try {
        // Fazer solicitação HTTP GET para a API Flask
        const responseUsuarios  = await axios.get('http://localhost:5000/cliente');
        console.log(responseUsuarios.data.dados)

        // Atualizar o estado com os dados recebidos
        //setUsuarios(responseUsuarios.data.usuarios);

      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    }

    // Chamar a função de busca quando o componente for montado
    fetchUsuarios();
  }, []); // A dependência vazia [] garante que esta função seja chamada apenas uma vez, quando o componente for montado

  // Renderizar a lista de usuários
  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {/*usuarios.map(usuario => (
          <li key={usuario.id}>{usuario.nome} - {usuario.email}</li>
        ))*/}
      </ul>
    </div>
  );
}

export default UserList;
